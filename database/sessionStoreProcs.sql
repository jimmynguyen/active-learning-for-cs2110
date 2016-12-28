-- Creates a new session
USE cs2110_active_learning;  
DELIMITER $$
DROP PROCEDURE IF EXISTS createNewSession$$
CREATE PROCEDURE createNewSession (
    IN SessionID int(11),
    IN QuestionID int(11),
    IN StartTime datetime,
    IN EndTime datetime)
BEGIN
    INSERT INTO session VALUES (SessionID, QuestionID, StartTime, EndTime);
END$$

-- Updates the session end time
DROP PROCEDURE IF EXISTS updateSessionEndTime$$
CREATE PROCEDURE updateSessionEndTime (
    IN SessionID int(11),
    IN EndTime datetime)
BEGIN
    UPDATE session SET end_time=EndTime WHERE session_id=SessionID;
END$$
DELIMITER ;