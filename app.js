const PORT = process.env.PORT || 8080;

const express = require('express');

const Razorpay = require('razorpay');
let app = express()

const razorpay = new Razorpay({
  key_id: 'rzp_test_7yYBr7vfhzpWwF',
  key_secret: 'iWbiK7AjZVRrBRXDO2UUSxdi',
})

var order_id;
var amt;
app.set('views','views');

app.set('view engine','ejs');

app.use(express.urlencoded({extended:false}));


app.get("/",(req,res) =>{
  res.render('index.ejs');
});


app.post("/makeOrder",(req,res) => {
  amt = req.body.amount
  res.render('razorpay.ejs');
})

app.post("/order",(req,res) => {
  let options = {
  amount: amt * 100,  // amount in the smallest currency unit
  currency: "INR",
};

 razorpay.orders.create(options,(err, order) => {
   console.log(order);
   order_id=order.id;
   res.json(order);
 })

});

app.post("/is-order-complete",(req,res) => {

  razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument) => {
    if(paymentDocument.status == "captured"){
      res.send("Payment sucessful");
    }
    else{
      res.send("Payment Failed");
    }
  })


});

app.listen(PORT);
