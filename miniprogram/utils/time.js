function js_date_time(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var _month = month >= 10 ? month : "0" + month;
  var day = dateTime.getDate();
  var _day = day >= 10 ? day : "0" + day;
  var hour = dateTime.getHours();
  var  _hour = hour >= 10 ? hour : "0" + hour;
  var minute = dateTime.getMinutes();
  var _minute = minute >= 10 ? minute : "0" + minute;
  var second = dateTime.getSeconds();
  var _second = second >= 10 ? second : "0" + second;
  var now = new Date();
  var now_new = Date.parse(now.toDateString()); //typescript转换写法
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + _month + '-' + _day + ' ' + _hour + ':' + _minute + ':' + _second;
  return timeSpanStr;
}
module.exports = {
  js_date_time: js_date_time
}