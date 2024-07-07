// /**
//  * @param {number[]} nums
//  * @return {void} Do not return anything, modify nums in-place instead.
//  */
// var moveZeroes = function (nums) {
//   let fz = 0;
//   let fn = 0;
//   let y = 0;

//   for (let i = 1; i < nums.length; i++) {
//     if (nums[i] == 0 && nums[i - 1] != 0) fz = i;
//     else if (nums[i] != 0) fn = i;
//     if (fn > fz && nums[fz] == 0) {
//       y = nums[fz];
//       nums[fz] = nums[fn];
//       nums[fn] = y;
//       fz = fz + 1;
//     }
//   }
//   return nums;
// };
// console.log(moveZeroes([1, 0, 0, 0, 0, 0, 1]));
// function generateRandomSixDigitNumber() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// console.log(generateRandomSixDigitNumber());

const session = {
  id: "evt_1Pa2iBP69vQIFrXjIcFyTsz6",
  object: "event",
  api_version: "2024-04-10",
  created: 1720388015,
  data: {
    object: {
      id: "cs_test_a13itqPZhvXLoGL0OuxGZzPAiw24ixzOaeruOXagzd1RpeVlbhAXwAUEUO",
      object: "checkout.session",
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 31220,
      amount_total: 31220,
      automatic_tax: {
        enabled: false,
        liability: null,
        status: null,
      },
      billing_address_collection: null,
      cancel_url: "http://natoursapp-lu63.onrender.com/cart",
      client_reference_id: "6689ee363cbb607b63ed1744",
      client_secret: null,
      consent: null,
      consent_collection: null,
      created: 1720387995,
      currency: "egp",
      currency_conversion: null,
      custom_fields: [],
      custom_text: {
        after_submit: null,
        shipping_address: null,
        submit: null,
        terms_of_service_acceptance: null,
      },
      customer: null,
      customer_creation: "if_required",
      customer_details: {
        address: {
          city: null,
          country: "EG",
          line1: null,
          line2: null,
          postal_code: null,
          state: null,
        },
        email: "eslam222@mailsac.com",
        name: "eslam",
        phone: null,
        tax_exempt: "none",
        tax_ids: [],
      },
      customer_email: "eslam222@mailsac.com",
      expires_at: 1720474395,
      invoice: null,
      invoice_creation: {
        enabled: false,
        invoice_data: {
          account_tax_ids: null,
          custom_fields: null,
          description: null,
          footer: null,
          issuer: null,
          metadata: {},
          rendering_options: null,
        },
      },
      livemode: false,
      locale: null,
      metadata: {},
      mode: "payment",
      payment_intent: "pi_3Pa2iAP69vQIFrXj0e0EfQGa",
      payment_link: null,
      payment_method_collection: "if_required",
      payment_method_configuration_details: {
        id: "pmc_1PLqZlP69vQIFrXj1JQcc8Zx",
        parent: null,
      },
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
      payment_method_types: ["card", "link"],
      payment_status: "paid",
      phone_number_collection: {
        enabled: false,
      },
      recovered_from: null,
      saved_payment_method_options: null,
      setup_intent: null,
      shipping_address_collection: null,
      shipping_cost: null,
      shipping_details: null,
      shipping_options: [],
      status: "complete",
      submit_type: null,
      subscription: null,
      success_url: "http://natoursapp-lu63.onrender.com/api/v1/order",
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: 0,
      },
      ui_mode: "hosted",
      url: null,
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: null,
    idempotency_key: null,
  },
  type: "checkout.session.completed",
};
console.log(session.data.object.metadata);
