describe("Create Safe", () => {
  it ("should create a new safe", () => {
    cy.visit("/app/welcome");    
    cy.contains("a", "Accept all").click();
    cy.contains("Not Connected").click();
    cy.contains("button", "Connect").click();
    cy.contains("MetaMask").click();    
    cy.acceptMetamaskAccess();
    cy.get("[data-testid=connected-wallet]").should("contain", "MetaMask");
    cy.contains("Create new Safe").click({ force: true });
    cy.contains("Continue").click();
    cy.get("[data-testid=create-safe-name-field]").type("Test Safe");
    cy.contains("button", "Continue").click({ force: true });
    cy.contains("button", "Continue").click({ force: true });
    cy.contains("button", "Create").click({ force: true });
    cy.confirmMetamaskTransaction({gasLimit: 523170});
    cy.contains("Your Safe was created successfully", { timeout: 60000});
  });
});

