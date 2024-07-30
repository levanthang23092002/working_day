const { callbackify } = require('util');
const db = require('../models/connect_db');
const { error } = require('console');

function merged(arr) {
    let tg = arr.length - 1;
    arr.sort((a, b) => a.start_day - b.start_day);
    for (let i = 0; i < tg; i++) {
        if (arr[i].end_day >= arr[i + 1].start_day) {
            arr[i + 1].start_day = arr[i].start_day;
            if (arr[i].end_day > arr[i + 1].end_day) {
                arr[i + 1].end_day = arr[i].end_day
            }
        }
    }
    const result = Object.values(arr.reduce((acc, item) => {
        acc[item.start_day] = item;
        return acc;
    }, {}));
    return result
}
const meeting = {
    getAllMeeting: (page, callback) => {
        try {
            let perPage = 5;
            let offset = (perPage * page) - perPage;
            let query = `SELECT u.id, u.first_name, u.last_name, u.email, u.gender, u.days, m.start_day, m.end_day
                        FROM users u
                        INNER JOIN meetings m ON u.id = m.user_id
                        ORDER BY u.id
                       `;
            db.query(query, (error, results) => {
                if (error) {
                    console.log('Error executing query:', error);
                    callback(error, null);
                } else {
                    const data = results.rows;

                    const result = data.reduce((acc, item) => {
                        const existingItem = acc.find(i => i.id === item.id);
                        if (existingItem) {
                            existingItem.day_meeting.push({ start_day: item.start_day, end_day: item.end_day });
                        } else {
                            acc.push({
                                id: item.id,
                                first_name: item.first_name,
                                last_name: item.last_name,
                                email: item.email,
                                days: item.days,
                                gender: item.gender,
                                day_meeting: [{ start_day: item.start_day, end_day: item.end_day }],
                                days_without_meetings: 0
                            });
                        }
                        return acc.splice(offset, perPage);
                    }, []);



                    // Tính toán lại days_without_meetings sau khi hợp nhất các khoảng ngày
                    result.forEach(user => {
                        const mergedMeetings = merged(user.day_meeting);
                        const totalMeetingDays = mergedMeetings.reduce((sum, meeting) => {
                            return sum + (meeting.end_day - meeting.start_day + 1);
                        }, 0);
                        user.days_without_meetings = user.days - totalMeetingDays;
                    });

                    callback(null, result);
                }
            });
        } catch (error) {
            console.log(error);
            callback(error, null);
        }
    },


    getMeeting: (id, callback) => {
        try {

            let query = `SELECT  u.id, u.first_name, u.last_name, u.email, u.gender, u.days, m.start_day, m.end_day
                        FROM users u
                        INNER JOIN meetings m ON u.id = m.user_id where m.user_id = ${id}
                        ORDER BY u.id
                        `;
            db.query(query, (error, results) => {
                if (error) {
                    console.log('Error executing query:', error);
                    callback(error, null);
                } else {
                    const data = results.rows;
                    const result = data.reduce((acc, curr) => {
                        let user = acc.find(u => u.id === curr.id);

                        if (!user) {
                            user = {
                                id: curr.id,
                                first_name: curr.first_name,
                                last_name: curr.last_name,
                                email: curr.email,
                                gender: curr.gender,
                                days: curr.days,
                                day_meet: [],
                                days_without_meetings: 0
                            };
                            acc.push(user);
                        }

                        user.day_meet.push({ start_day: curr.start_day, end_day: curr.end_day });


                        return acc;
                    }, []);
                    const mergedMeetings = merged(result[0].day_meet);
                    const totalMeetingDays = mergedMeetings.reduce((sum, meeting) => {
                        return sum + (meeting.end_day - meeting.start_day + 1);
                    }, 0);
                    result[0].days_without_meetings = result[0].days - totalMeetingDays;
                    callback(null, result);
                }
            });
        } catch (error) {
            console.log(error);
            callback(error, null);
        }
    },
    getallmeets: (page, callback) => {
        try {
            let perPage = 5;
            let offset = (perPage * page) - perPage;
            let query = `select id, user_id, room_id, start_day, end_day from meetings LIMIT ${perPage} OFFSET ${offset} `;
            db.query(query, (error, results) => {
                if (error) {
                    console.log('Error executing query:', error);
                    callback(error, null);
                } else {
                    callback(null, results.rows)
                }
            })
        } catch (error) {
            console.log('Error executing query:', error);
            callback(error, null);
        }

    },
    getmeets: (id, callback) => {
        try {
            let query = `select id, user_id, room_id, start_day, end_day from meetings where id = ${id} `;
            db.query(query, (error, results) => {
                if (error) {
                    console.log('Error executing query:', error);
                    callback(error, null);
                } else {
                    callback(null, results.rows)
                }
            })
        } catch (error) {
            console.log('Error executing query:', error);
            callback(error, null);
        }

    },
    updateMeeting: (id, data, callback) => {
        let query = `
        UPDATE meetings SET user_id = $1, room_id = $2, start_day = $3, end_day = $4 WHERE id = ${id} 
    `;
        db.query(query, data, (error, results) => {
            if (error) {
                console.log('Error executing query:', error);
                callback(error, null);
            } else {
                callback(null, results.rowCount);
            }
        })
    },
    postMeeting: (data, callback) => {
        let query = `INSERT INTO meetings (id, user_id, room_id, start_day, end_day)
                  VALUES ($1, $2, $3, $4, $5)
    `;
        db.query(query, data, (error, results) => {
            if (error) {
                console.log('Error executing query:', error);
                callback(error, null);
            } else {
                callback(null, results.rowCount);
            }
        })
    }
}


module.exports = meeting;