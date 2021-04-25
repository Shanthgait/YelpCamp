function timeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
      let year = Math.floor(interval);
      if(year <= 1){
        return year + " yr";
      }
      return year + " yrs"
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      let month = Math.floor(interval);
      if(month <= 1){
        return month + " month";
      }else{
        return month + " months";
      }
    }
    interval = seconds / 86400;
    if (interval > 1) {
      let day = Math.floor(interval);
      if(day <= 1){
        return day + " day";
      }
      return day + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      let hour = Math.floor(interval);
      if(hour <= 1){
        return  hour + " hr";
      }
      return  hour + " hrs";
    }
    interval = seconds / 60;
    if (interval > 1) {
      let minute = Math.floor(interval);
      if(minute <= 1){
        return minute  + " min";
      }
      return minute + " mins";
      
    }
    let second = Math.floor(seconds);
    if(second <= 1){
      return second + " sec";
    }
    return second + " secs";

  }

  module.exports = timeSince;