% MATLAB function to generate a sql script of the course content given a .xlsx filename
function convert2sql(filename)

    % read .xlsx file
    [num, txt, raw] = xlsread(filename);

    % remove headers
    headers = raw(1, :);
    raw = raw(2:end, :);

    % get columns
    moduleCol = strcmpi(headers, 'module');
    nameCol = strcmpi(headers, 'name');
    questionCol = strcmpi(headers, 'question');
    explanationCol = strcmpi(headers, 'explanation');
    correctAnswerCol = strcmpi(headers, 'correct answer');
    incorrectAnswer1Col = strcmpi(headers, 'incorrect answer 1');
    incorrectAnswer2Col = strcmpi(headers, 'incorrect answer 2');
    incorrectAnswer3Col = strcmpi(headers, 'incorrect answer 3');
    incorrectAnswer4Col = strcmpi(headers, 'incorrect answer 4');

    % initialize output
    out = 'use cs2110_active_learning;\ntruncate module;\ntruncate question;\ntruncate answer;\n';

    % get unique modules and generate sql
    modules = unique(raw(2:end, moduleCol));

    sql = 'insert into module (name) values ';
    for ndx = 1:length(modules)
        module = modules{ndx};
        sql = sprintf('%s(''%s''),', sql, module);
    end
    out = [out, sql(1:end-1), ';\n\n'];

    % get questions and answer choices and generate sql
    for ndx = 1:size(raw,1)
        module = raw{ndx, moduleCol};
        name = raw{ndx, nameCol};
        content = raw{ndx, questionCol};
        explanation = raw{ndx, explanationCol};
        correctAnswer = raw{ndx, correctAnswerCol};
        incorrectAnswer1 = raw{ndx, incorrectAnswer1Col};
        incorrectAnswer2 = raw{ndx, incorrectAnswer2Col};
        incorrectAnswer3 = raw{ndx, incorrectAnswer3Col};
        incorrectAnswer4 = raw{ndx, incorrectAnswer4Col};

        if ~isnan(content)
            name = removeInvalidCharacters(name);
            content = removeInvalidCharacters(content);
            explanation = removeInvalidCharacters(explanation);
            correctAnswer = removeInvalidCharacters(correctAnswer);
            incorrectAnswer1 = removeInvalidCharacters(incorrectAnswer1);
            incorrectAnswer2 = removeInvalidCharacters(incorrectAnswer2);
            incorrectAnswer3 = removeInvalidCharacters(incorrectAnswer3);
            incorrectAnswer4 = removeInvalidCharacters(incorrectAnswer4);

            module_id = sprintf('(select module_id from module where name = ''%s'')', module);
            sql = sprintf('insert into question (module_id,name,content,explanation) values (%s,''%s'',''%s'',''%s'');\n', module_id, name, content, explanation);
            out = [out, sql];

            question_id = sprintf('(select question_id from question where content = ''%s'')', content);
            sql = 'insert into answer (question_id,content,is_correct) values ';
            sql = getAnswer(sql, question_id, correctAnswer, 1);
            sql = getAnswer(sql, question_id, incorrectAnswer1, 0);

            if ~isempty(incorrectAnswer2) && ~strcmpi(incorrectAnswer2, 'null')
                sql = getAnswer(sql, question_id, incorrectAnswer2, 0);
            end
            if ~isempty(incorrectAnswer3) && ~strcmpi(incorrectAnswer3, 'null')
                sql = getAnswer(sql, question_id, incorrectAnswer3, 0);
            end
            if ~isempty(incorrectAnswer4) && ~strcmpi(incorrectAnswer4, 'null')
                sql = getAnswer(sql, question_id, incorrectAnswer4, 0);
            end
            out = [out, sql(1:end-1), ';\n\n'];
        end
    end

    % get new filename
    [~, filename] = fileparts(filename);
    filename = sprintf('%s.sql', filename);
    fh = fopen(filename, 'w');
    fprintf(fh, out);
    fclose(fh);

end

function sql = getAnswer(sql, question_id, answer, is_correct)

    if ischar(answer)
        sql = sprintf('%s(%s,''%s'',%d),', sql, question_id, answer, is_correct);
    elseif isnumeric(answer)
        sql = sprintf('%s(%s,''%s'',%d),', sql, question_id, num2str(answer), is_correct);
    elseif islogical(answer)
        if answer
            sql = sprintf('%s(%s,''%s'',%d),', sql, question_id, 'TRUE', is_correct);
        else
            sql = sprintf('%s(%s,''%s'',%d),', sql, question_id, 'FALSE', is_correct);
        end
    else
        error('please don''t error: %s', class(answer));
    end

end

function str = removeInvalidCharacters(str)

    str = strrep(str, '''', '''''');
    str = strrep(str, char(8217), '''''');

end