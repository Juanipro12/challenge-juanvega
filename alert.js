class Alert {
  constructor(
    id,
    text,
    type,
    subject,
    expirationDate = null,
    recipient = null
  ) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.subject = subject;
    this.expirationDate = expirationDate;
    this.recipient = recipient;
    this.readBy = new Set();
  }

  markAsRead(user) {
    this.readBy.add(user);
  }
}

module.exports = Alert