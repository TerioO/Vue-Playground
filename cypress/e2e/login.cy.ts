describe("The Login page", () => {
    it("Should fail a login", () => {
        cy.visit("/login");

        cy.get("input").first().type("Hello");
        cy.get("input").eq(1).type("Hello123");
        cy.get("button").click();

        cy.url().should("contain", "/login");
    });

    it("Should login successfully", () => {
        cy.visit("/login");

        cy.get("input").eq(0).type("Dave");
        cy.get("input").eq(1).type("Dave");
        cy.get("button").click();

        cy.url().should("contain", "/")
    })
})