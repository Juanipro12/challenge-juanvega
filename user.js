class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.subscribedSubject = new Set();
  }

  subscribeToSubject(subject) {
    this.subscribedSubject.add(subject);
  }

  markAlertAsRead(alert) {
    alert.readBy.add(this);
  }

  getUnreadAlerts(alerts) {
    return alerts.filter(alert => {
      return (alert.recipient === this || alert.recipient === null) && !alert.readBy.has(this);
    });
  }
}

module.exports = User;
