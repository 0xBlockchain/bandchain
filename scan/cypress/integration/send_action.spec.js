/// <reference types="cypress" />

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Should have s address on account panel", () => {
    cy.get('[id="connectButton"]').click();
    cy.get('[id="mnemonicInput"]').type("s");
    cy.get('[id="mnemonicConnectButton"]').click();
    cy.get('[id="userInfoButton"]').click();
    cy.get('[id="addressWrapper"] > a > span').should(
      "contain",
      "band1jrhuqrymzt4mnvgw8cvy3s9zhx3jj0dq30qpte"
    );
  });
});

describe("Send", () => {
  it("Status should be Success", () => {
    cy.get('[id="sendToken"]').contains("Send").click();
    cy.get('[placeholder="Insert recipient address"]')
      .wait(1000)
      .type("band1mrdmxkhtr3rgfzfgrkxy5pvjtvnm5qq0my5m0x")
      .get('[placeholder="Insert send amount"]')
      .type("2");
    cy.get('[id="nextButton"]').contains("Next").click();
    cy.get('[id="broadcastButton"]').click();
    cy.get('[id="successMsgContainer"] > span').should(
      "contain",
      "Broadcast Transaction Success"
    );
  });
});
