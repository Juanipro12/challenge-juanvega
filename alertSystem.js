const User = require("./user");

class AlertSystem {
  constructor() {
    this.users = new Map();
    this.subject = new Map();
    this.alerts = [];
    this.userCount = 0;
  }

  registerUser(name) {
    this.userCount++;
    const user = new User(this.userCount, name);
    this.users.set(user.id, user);
  }

  registerSubject(subject) {
    this.subject.set(subject.id, subject);
  }

  sendAlert(alert) {
    this.alerts.push(alert);
  }

  sendAlertToUser(alert, user) {
    if (this.users.has(user.id)) {
      user.getUnreadAlerts().push(alert);
    }
  }

  getUnreadAlertsForUser(user) {
    const unreadAlerts = this.alerts.filter((alert) => {
      return (
        (alert.recipient === user || alert.recipient === null) &&
        !alert.readBy.has(user)
      );
    });

    return this.filterAndSortAlerts(unreadAlerts);
  }

  getUnreadAlertsForSubject(subject) {
    const unreadAlerts = this.alerts.filter((alert) => {
      return (
        alert.subject === subject &&
        Array.from(this.users.values()).some((user) => {
          return (
            !alert.readBy.has(user) &&
            (alert.recipient === user || alert.recipient === null)
          );
        })
      );
    });
    return this.filterAndSortAlerts(unreadAlerts);
  }

  getUnreadNotExpiredAlertsForUser(user) {
    const currentTime = new Date();
    return this.alerts.filter((alert) => {
      return (
        alert.expirationDate === null || alert.expirationDate > currentTime
      ) && !alert.readBy.has(user) && (alert.recipient === user || alert.recipient === null);
    });
  }

  getUnexpiredAlertsForSubject(subject) {
    const currentDate = new Date();
    const unexpiredAlerts = this.alerts.filter((alert) => {
      return (
        alert.subject === subject &&
        (!alert.expirationDate || alert.expirationDate > currentDate)
      );
    });
    return this.filterAndSortAlerts(unexpiredAlerts);
  }

  filterAndSortAlerts(unreadAlerts) {
    unreadAlerts.sort((a, b) => {
      if (a.type === "Urgente" && b.type === "Informativa") {
        return -1;
      } else if (a.type === "Informativa" && b.type === "Urgente") {
        return 1;
      }
      return 0;
    });

    return unreadAlerts;
  }
}

module.exports = AlertSystem;
