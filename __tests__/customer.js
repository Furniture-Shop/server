const request = require("supertest");
const app = require("../app");
const Customer = require("../models/customer");

const customerSignup = {
   fullName: "tester123",
   email: "tester@tester.com",
   password: "tester123",
};

const customerLogin = {
   fullName: "testers123",
   email: "testers@testers.com",
   password: "testers123",
};

beforeEach(async () => {
   await Customer.deleteMany({});
   await Customer(customerLogin).save();
});

test("Should signup for a user", async () => {
   await request(app)
      .post("/api/customer/signup")
      .send(customerSignup)
      .expect(201);
});

// Another way of making unit testing
/*describe("POST /api/customer/signup", () => {
   it("Responds with 201", () => {
      request(app)
         .post("/api/customer/signup")
         .send(customer)
         .expect(201);
   });
});*/
