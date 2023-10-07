require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const user = require("../models/user");
const contacts = require("../models/contacts");
const port = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://root:root@cluster0.24xy2dq.mongodb.net/?retryWrites=true&w=majority");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    credentials: true, //access-control-allow-credentials:true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/new', async(req, res) => {
    res.send('Connected to backend');
})

app.post("/signIn", async (req, res) => {
    try {
        let userData = await user.find({user: req.body.user, password: req.body.password});
        if(userData.length > 0) {
          let data = await contacts.find({user: req.body.user});
          let contact = data.map((data) => {
            return {
              company: data.company,
              country: data.country,
              name: data.name,
              email: data.email,
              phone: data.phone,
              industry: data.industry,
              designation: data.designation
            }
          })
          res.send({
            contacts: contact,
            error: false,
          });
        } else {
            res.send({
                error: true,
                message: 'Invalid credentials',
            })
        }
    } catch (err) {
      res.send({
        message: err,
        error: true,
      });
    }
  });

  app.post("/signUp", async (req, res) => {
    try {
        let userData = await user.find({user: req.body.user});
        if(userData.length === 0) {
            await user.create({ ...req.body });
            res.send({
            message: "User created",
            error: false,
            });
        } else {
            res.send({
                message: "User already exist",
                error: true,
            })
        }
    } catch (err) {
      res.send({
        message: err,
      });
    }
  });

app.post("/importContacts", async (req, res) => {
  try {
    let user = req.body.user;
    let contact = req.body.contacts.map((data) => {
      return {
        company: data.company,
        country: data.country,
        name: data.name,
        email: data.email,
        phone: data.phone,
        industry: data.industry,
        designation: data.designation,
        user,
      };
    })
    if(contact.length !== 0) {
      await contact.forEach(async (obj) => {
        await contacts.create({...obj});
      })
    }
    res.send({
      message: "success",
      error: false
    })
  } catch (err) {
    res.send({
      message: err,
    });
  }
})

app.post("/deleteContacts", async(req, res) => {
  try {
    let contact = req.body.contacts;
    let user = req.body.user;
    if(contact.length !== 0) {
        contact.forEach(async (data) => {
          await contacts.deleteOne({...data, user});
        })
    }
  } catch (err) {
    res.send({
      message: err,
    });
  }
})

app.listen(port, () => console.log(`server running on port ${port}`));