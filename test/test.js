const assert = require("assert");
const AlertSystem = require("../alertSystem");
const Subject = require("../subject");
const User = require("../user");
const Alert = require("../alert");

describe("Registro de Usuarios", () => {
  it("Debería permitir registrar un usuario", () => {
    const alertSystem = new AlertSystem();
    alertSystem.registerUser("Usuario1");

    assert.strictEqual(alertSystem.users.size, 1);
  });
});

describe("Alert System", () => {
  it("Se pueden registrar temas", () => {
    const alertSystem = new AlertSystem();
    const subject1 = new Subject(1, "Tema 1");
    const subject2 = new Subject(2, "Tema 2");

    alertSystem.registerSubject(subject1);
    alertSystem.registerSubject(subject2);

    assert.strictEqual(alertSystem.subject.has(1), true);
    assert.strictEqual(alertSystem.subject.has(2), true);
  });
});

describe("Alert System", () => {
  it("Los usuarios pueden optar sobre cuales temas quieren recibir alertas", () => {
    const alertSystem = new AlertSystem();
    const user1 = new User(1, "Usuario 1");
    const user2 = new User(2, "Usuario 2");
    const subject1 = new Subject(1, "Tema 1");
    const subject2 = new Subject(2, "Tema 2");

    alertSystem.registerUser(user1);
    alertSystem.registerUser(user2);
    alertSystem.registerSubject(subject1);
    alertSystem.registerSubject(subject2);

    user1.subscribeToSubject(subject1);
    user1.subscribeToSubject(subject2);

    user2.subscribeToSubject(subject2);

    assert.strictEqual(user1.subscribedSubject.has(subject1), true);
    assert.strictEqual(user1.subscribedSubject.has(subject2), true);

    assert.strictEqual(user2.subscribedSubject.has(subject2), true);
    assert.strictEqual(user2.subscribedSubject.has(subject1), false);
  });
});

describe("Alert System", () => {
  it("Se puede enviar una alerta sobre un tema y lo reciben todos los usuarios que han optado recibir alertas de ese tema", () => {
    const alertSystem = new AlertSystem();
    const user1 = new User(1, "Usuario 1");
    const user2 = new User(2, "Usuario 2");
    const subject1 = new Subject(1, "Tema 1");
    const alert = new Alert(1, "Alerta de prueba", "Informativa", subject1);

    alertSystem.registerUser(user1);
    alertSystem.registerUser(user2);
    alertSystem.registerSubject(subject1);

    user1.subscribeToSubject(subject1);
    user2.subscribeToSubject(subject1);

    alertSystem.sendAlert(alert);

    const user1UnreadAlerts = alertSystem.getUnreadAlertsForUser(user1);
    const user2UnreadAlerts = alertSystem.getUnreadAlertsForUser(user2);

    assert.strictEqual(user1UnreadAlerts.length, 1);
    assert.strictEqual(user2UnreadAlerts.length, 1);
    assert.strictEqual(user1UnreadAlerts[0].id, alert.id);
    assert.strictEqual(user2UnreadAlerts[0].id, alert.id);
  });
});

describe("Alert System", () => {
  it("Se puede enviar una alerta sobre un tema y lo reciben todos los usuarios que han optado recibir alertas de ese tema", () => {
    const alertSystem = new AlertSystem();
    const user1 = new User(1, "Usuario 1");
    const user2 = new User(2, "Usuario 2");
    const subject1 = new Subject(1, "Tema 1");
    const alert = new Alert(1, "Alerta de prueba", "Informativa", subject1);

    alertSystem.registerUser(user1);
    alertSystem.registerUser(user2);
    alertSystem.registerSubject(subject1);

    user1.subscribeToSubject(subject1);
    user2.subscribeToSubject(subject1);

    alertSystem.sendAlert(alert);

    const user1UnreadAlerts = alertSystem.getUnreadAlertsForUser(user1);
    const user2UnreadAlerts = alertSystem.getUnreadAlertsForUser(user2);

    assert.strictEqual(user1UnreadAlerts.length, 1);
    assert.strictEqual(user2UnreadAlerts.length, 1);
    assert.strictEqual(user1UnreadAlerts[0].id, alert.id);
    assert.strictEqual(user2UnreadAlerts[0].id, alert.id);
  });
});

describe("Alert System", () => {
  it("Una alerta puede tener una fecha y hora de expiración", () => {
    const alertSystem = new AlertSystem();
    const user = new User(1, "Usuario 1");
    const subject = new Subject(1, "Tema 1");
    const expirationDate = new Date("2023-12-31T23:59:59");
    const alert = new Alert(
      1,
      "Alerta con expiración",
      "Informativa",
      subject,
      expirationDate,
      user
    );

    alertSystem.registerUser(user);
    alertSystem.registerSubject(subject);

    user.subscribeToSubject(subject);

    alertSystem.sendAlert(alert);

    const receivedAlerts = alertSystem.getUnreadAlertsForUser(user);

    assert.strictEqual(receivedAlerts.length, 1);
    assert.strictEqual(receivedAlerts[0].expirationDate, expirationDate);
  });
});

describe("Alert System", () => {
  it("Hay dos tipos de alertas: Informativas y Urgentes", () => {
    const alertSystem = new AlertSystem();
    const user = new User(1, "Usuario 1");
    const subject = new Subject(1, "Tema 1");

    alertSystem.registerUser(user);
    alertSystem.registerSubject(subject);

    user.subscribeToSubject(subject);

    const alertInformativa = new Alert(
      1,
      "Alerta Informativa",
      "Informativa",
      subject
    );
    alertSystem.sendAlert(alertInformativa);

    const alertUrgente = new Alert(2, "Alerta Urgente", "Urgente", subject);
    alertSystem.sendAlert(alertUrgente);

    const receivedAlerts = alertSystem.getUnreadAlertsForUser(user);

    assert.strictEqual(receivedAlerts.length, 2);

    const informativas = receivedAlerts.filter(
      (alert) => alert.type === "Informativa"
    );
    const urgentes = receivedAlerts.filter((alert) => alert.type === "Urgente");

    assert.strictEqual(informativas.length, 1);
    assert.strictEqual(urgentes.length, 1);
  });
});

describe("Alert System", () => {
  it("Un usuario puede marcar una alerta como leída", () => {
    const alertSystem = new AlertSystem();
    const user = new User(1, "Usuario 1");
    const subject = new Subject(1, "Tema 1");

    alertSystem.registerUser(user);
    alertSystem.registerSubject(subject);

    user.subscribeToSubject(subject);

    const alert = new Alert(1, "Alerta de Prueba", "Informativa", subject);
    alertSystem.sendAlert(alert);

    const unreadAlerts = alertSystem.getUnreadAlertsForUser(user);
    assert.strictEqual(unreadAlerts.length, 1);

    user.markAlertAsRead(alert);

    const unreadAlertsAfterMarkedRead =
      alertSystem.getUnreadAlertsForUser(user);
    assert.strictEqual(unreadAlertsAfterMarkedRead.length, 0);
  });
});

describe("Alert System", () => {
  it("Se pueden obtener todas las alertas no expiradas de un usuario que aún no ha leído", () => {
    const alertSystem = new AlertSystem();
    const user = new User(1, "Usuario 1");
    const subject = new Subject(1, "Tema 1");

    alertSystem.registerUser(user);
    alertSystem.registerSubject(subject);

    user.subscribeToSubject(subject);

    const alertNoLeida = new Alert(
      1,
      "Alerta No Leída",
      "Informativa",
      subject
    );
    alertSystem.sendAlert(alertNoLeida);

    const alertLeida = new Alert(2, "Alerta Leída", "Informativa", subject);
    alertSystem.sendAlert(alertLeida);
    user.markAlertAsRead(alertLeida);

    const alertExpirada = new Alert(
      3,
      "Alerta Expirada",
      "Informativa",
      subject,
      new Date(2023, 0, 1)
    );
    alertSystem.sendAlert(alertExpirada);

    const alertasNoLeidas = alertSystem.getUnreadNotExpiredAlertsForUser(user);

    assert.strictEqual(alertasNoLeidas.length, 1);
    assert.strictEqual(alertasNoLeidas[0], alertNoLeida);
  });
});

describe("Alert System", () => {
  it("Se pueden obtener todas las alertas no expiradas para un tema", () => {
    const alertSystem = new AlertSystem();
    const user1 = new User(1, "Usuario 1");
    const user2 = new User(2, "Usuario 2");
    const subject = new Subject(1, "Tema 1");

    alertSystem.registerUser(user1);
    alertSystem.registerUser(user2);
    alertSystem.registerSubject(subject);

    user1.subscribeToSubject(subject);
    user2.subscribeToSubject(subject);

    const alert1 = new Alert(1, "Alerta para todos", "Informativa", subject);
    const alert2 = new Alert(
      2,
      "Alerta solo para Usuario 1",
      "Informativa",
      subject,
      null,
      user1
    );

    alertSystem.sendAlert(alert1);
    alertSystem.sendAlert(alert2);

    const unreadAlertsForSubject =
      alertSystem.getUnexpiredAlertsForSubject(subject);

    assert.strictEqual(unreadAlertsForSubject.length, 2);

    const alertDestinations = unreadAlertsForSubject.map((alert) => {
      return {
        id: alert.id,
        recipient: alert.recipient ? alert.recipient.name : "Todos",
      };
    });

    assert.deepStrictEqual(alertDestinations, [
      { id: 1, recipient: "Todos" },
      { id: 2, recipient: "Usuario 1" },
    ]);
  });
});
