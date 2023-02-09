//เรียกใช้ node_modules และ package เพื่อ ให้ code ทำงานได้
var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jwt = require("jsonwebtoken");
const secret = "From-login";
const bcrypt = require("bcrypt");
const saltRounds = 10;

// End code เรียกใช้

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//cors
//ประกาศใช้ cors และ urlencoded เพื่อให้ code สามารถเรียกใช้ได้บน url
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// End code cors

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//sql
const mysql = require("mysql2");
const { text } = require("body-parser");
const { query } = require("express");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "123456789",
  database: "rehearsal",
});
//End code sql

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function
//function register
app.post("/register", jsonParser, function (req, res, next) {
  // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
  var sql =
    "INSERT INTO users(users_name,password,user_status,names,phone) VALUES(?,?,?,?,?)";
  connection.execute(
    sql,
    [
      req.body.users_name,
      req.body.password,
      req.body.user_status,
      req.body.names,
      req.body.phone,
    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});
// });
//function register

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function edit_user
app.put("/edit_user/:id", jsonParser, function (req, res, next) {
  let id = req.params.id;
  var sql = `UPDATE users SET ? WHERE user_id = ${id}`;
  const data = {
    users_name: req.body.users_name,
    password: req.body.password,
    user_status: req.body.user_status,
    names: req.body.names,
    phone: req.body.phone,
  };
  connection.query(sql, [data], function (err, results, fields) {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }
    res.json({
      status: "ok",
      results: " Updated Sucsess!!",
    });
  });
});
//function edit_user

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function DELETE_user
app.delete("/delete_user/:id", jsonParser, function (req, res, next) {
  const { id } = req.params;
  connection.query(
    `DELETE FROM users WHERE user_id = ${id}`,
    [id],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({
        status: "ok",
        results: "Deleteted Sucsess!!",
      });
    }
  );
});

app.delete("/delete_user", jsonParser, function (req, res, next) {
  connection.query(
    `DELETE FROM users WHERE user_id`,
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({
        status: "ok",
        results: "Deleteted Sucsess!!",
      });
    }
  );
});

//function edit_user

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function login
app.post("/login", jsonParser, function (req, res, next) {
  var sql = "SELECT * FROM users WHERE users_name = ?";
  connection.execute(sql, [req.body.users_name], function (err, users, fields) {
    if (err) {
      res.json({ status: "error", message: "err" });
      return;
    }
    if (users.length == 0) {
      res.json({ status: "error", message: "no user foud" });
      return;
    }
    bcrypt.compare(function (err, fields) {
      if (req.body.password == users[0].password) {
        var token = jwt.sign({ email: users[0].users_name }, "From-login", {
          expiresIn: "4h",
        });
        res.json({
          status: "ok",
          message: "Login Sucsess",
          user_id: users[0].user_id,
          token,
        });
      } else {
        res.json({ status: false, message: "Login False", err });
      }
    });
  });
});

//function login

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function authen
app.post("/authen", jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, "From-login");
    res.json({ status: "ok", message: "Sucsess", decoded });
  } catch (err) {
    res.json({ status: "err", message: err.message });
  }
});

//function authen

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function profile ถ้าจะจำกัดการแสดงข้อมมูลใช้ตัวนี้ "LIMIT 2"

app.get("/profile", jsonParser, function (req, res, next) {
  connection.query("SELECT * FROM users ", function (err, results, fields) {
    if (results) {
      res.json({ status: true, results });
    } else {
      res.json({ status: false, message: err });
      return;
    }
  });
});

//profile By id
app.get("/profile/:id", jsonParser, function (req, res, next) {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM `users` WHERE user_id = ?",
    [id],
    function (err, results, fields) {
      if (results) {
        res.json({ status: true, results });
      } else {
        res.json({ status: false, message: err });
        return;
      }
    }
  );
});

//profile By id
//function profile staus,

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function add_information
app.post("/add_information", jsonParser, function (req, res, next) {
  connection.query(
    "INSERT INTO repair_information (staus,user_id,date_repair,work_group,work,phone,computer_name,responsible_person,commodity_code,ip_address,equipment,other,problem_symptom,requirements,name_sender,name_responsible,date_receive) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.staus,
      req.body.user_id,
      req.body.date_repair,
      req.body.work_group,
      req.body.work,
      req.body.phone,
      req.body.computer_name,
      req.body.responsible_person,
      req.body.commodity_code,
      req.body.ip_address,
      req.body.equipment,
      req.body.other,
      req.body.problem_symptom,
      req.body.requirements,
      req.body.name_sender,
      req.body.name_responsible,
      req.body.date_receive,
    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: false, message: err });
        //console.log(results);
        return;
      }
      res.json({ status: true });
    }
  );
});
//function add_information

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//edit_information
app.put("/edit_information/:id", jsonParser, function (req, res, next) {
  let id = req.params.id;
  const data = {
    staus: req.body.staus,
    // date_repair: req.body.date_repair,
    // work_group: req.body.work_group,
    // work: req.body.work,
    // phone: req.body.phone,
    // computer_name: req.body.computer_name,
    // responsible_person: req.body.responsible_person,
    // commodity_code: req.body.commodity_code,
    // ip_address: req.body.ip_address,
    // equipment: req.body.equipment,
    // other: req.body.other,
    // problem_symptom: req.body.problem_symptom,
    // requirements: req.body.requirements,
    // name_sender: req.body.name_sender,
    name_responsible: req.body.name_responsible,
    date_receive: req.body.date_receive,
  };
  connection.query(
    `UPDATE repair_information SET ? WHERE id_repair_i = ${id}`,
    [data],
    function (err, results, fields) {
      if (err) {
        res.json({ status: false, message: err });
        return;
      }
      //console.log(results);
      res.json({
        status: "ok",
        results: "Updated Sucsess!!",
        state: true,
      });
    }
  );
});

app.put("/edit_information_addmind/:id", jsonParser, function (req, res, next) {
  let id = req.params.id;
  const data = {
    // user_id:req.body.user_id,
    // staus: req.body.staus,
    // date_repair: req.body.date_repair,
    work_group: req.body.work_group,
    work: req.body.work,
    phone: req.body.phone,
    // computer_name: req.body.computer_name,
    responsible_person: req.body.responsible_person,
    commodity_code: req.body.commodity_code,
    // ip_address: req.body.ip_address,
    equipment: req.body.equipment,
    // other: req.body.other,
    problem_symptom: req.body.problem_symptom,
    requirements: req.body.requirements,
    name_sender: req.body.name_sender,
    // name_responsible: req.body.name_responsible,
    // date_receive: req.body.date_receive,
  };
  connection.query(
    `UPDATE repair_information SET ? WHERE id_repair_i = ${id}`,
    [data],
    function (err, results, fields) {
      if (err) {
        res.json({ status: false, message: err });
        return;
      }
      //console.log(results);
      res.json({
        status: "ok",
        results: "Updated Sucsess!!",
        state: true,
      });
    }
  );
});

//edit_information

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function Delete_information
app.delete("/delete_information/:id", jsonParser, function (req, res, next) {
  const { id } = req.params;
  connection.query(
    `DELETE FROM repair_information WHERE id_repair_i = ${id}`,
    [id],
    function (err, results, fields) {
      if (err) {
        res.json({ status: false, message: err });
        return;
      }
      res.json({
        status: "ok",
        results: "Deleteted Sucsess!!",
      });
    }
  );
});

app.delete("/delete_information", jsonParser, function (req, res, next) {
  connection.query(
    `DELETE FROM repair_information`,
    function (err, results, fields) {
      if (err) {
        res.json({ status: false, message: err });
        return;
      }
      res.json({
        status: "ok",
        results: "Deleteted Sucsess!!",
      });
    }
  );
});

//function Delete_information

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function Get_information

//แสดง ข้อมูล
app.get("/Getall_information", jsonParser, function (req, res, next) {
  connection.query(
    `SELECT * FROM repair_information`,
    function (err, results, fields) {
      if (results) {
        var lengthdata = results.length;
        // //console.log(results);
        res.status(200).json({ status: true, lengthdata: lengthdata, results });
      } else {
        res.json({ status: false, message: err });
        return;
      }
    }
  );
});

app.get("/Get_information", jsonParser, function (req, res, next) {
  const id = req.params.id;
  connection.query(
    `SELECT * FROM repair_information WHERE id_repair_i = ${id}`,
    function (err, results, fields) {
      if (results) {
        // var lengthdata = results.length;
        // //console.log(results);
        res.status(200).json({ status: true, results });
      } else {
        res.json({ status: false, message: err });
        return;
      }
    }
  );
});

app.get("/Get_byID/:id_repair_i", jsonParser, function (req, res, next) {
  const id = req.params.id_repair_i;
  const sql = `SELECT * FROM repair_information WHERE id_repair_i = ${id}`;
  connection.query(sql, function (err, results, fields) {
    if (results) {
      var lengthdata = results.length;
      // //console.log(results);
      res
        .status(200)
        .json({ staus: "ok", lengthdata: lengthdata, results: results[0] });
    } else {
      res.json({ status: false, message: err, fields: fields });
      return;
    }
  });
});

// เวลาใช้ ต้องใช้ คำที่เป็นคีย์ในการเลือกแสดงและคอบด้วย "" อย่างเช่น "กำลังดำเนินการ"
app.get("/Get_req/:?", jsonParser, function (req, res, next) {
  var staus = req.query.staus;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const id = parseInt(req.query.user_id);
  const search = req.query.search;

  var sql = `SELECT * FROM repair_information `;

  if (staus || id || search) {
    sql += `WHERE `;
  }
  if (!staus) {
  } else {
    sql += ` staus = '${staus}'`;
  }

  if (!id) {
  } else {
    if (staus) {
      sql += `AND user_id = '${id}'`;
    } else {
      sql += ` user_id = '${id}'`;
    }
  }
  if (!search) {
  } else {
    if (staus || id) {
      sql += ` AND name_sender LIKE "%${search}%"`;
    } else {
      sql += ` name_sender LIKE "%${search}%"`;
    }
  }
  // if (!id) {
  //   var sql = `SELECT * FROM repair_information WHERE staus = '${staus}' `;
  // } else {
  //   var sql = `SELECT * FROM repair_information WHERE (staus = '${staus}' AND user_id = ${id} ) `;
  // }
  // if (staus === "ทั้งหมด") {
  //   if (!id) {
  //     var sql = `SELECT * FROM repair_information `;
  //   }
  //   else {
  //     var sql = `SELECT * FROM repair_information WHERE user_id = ${id} `;
  //   }
  // }
  // if (search){
  //   var sql = `SELECT * FROM repair_information WHERE name_sender  LIKE "%n%" AND staus = "รอตอบรับ"AND user_id = 5 `
  //   // params.push("%" + search + "%");
  //   console.log("search");
  // }
  //  else {
  //   var sql = `SELECT * FROM repair_information `
  // }

  sql += " LIMIT ?,? ";
  const start_idx = (page - 1) * limit;
  var params = [];

  params.push(start_idx);
  params.push(limit);
  connection.query(sql, params, function (err, results, fields) {
    ////console.log(results);
    if (results) {
      var lengthdata = results.length;
      res.status(200).json({ status: true, results: results });
    } else {
      res.json({ status: false, message: err });
      return;
    }
  });
});

app.get("/Get_all_req/:?", jsonParser, function (req, res, next) {
  var stauss = req.query.staus;
  const id = parseInt(req.query.user_id);

  if (stauss) {
    if (!id) {
      var sql = `SELECT * FROM repair_information WHERE staus = "${stauss}"`;
    } else {
      var sql = `SELECT * FROM repair_information WHERE (staus = '${stauss}' AND user_id = ${id} ) `;
    }
  } else {
    var reeor = "ไม่พบข้อมูล";
  }

  if (stauss === "ทั้งหมด") {
    if (!id) {
      var sql = `SELECT * FROM repair_information`;
    } else {
      var sql = `SELECT * FROM repair_information WHERE user_id = ${id}`;
    }
  } else {
    var reeor = "ไม่พบข้อมูล";
  }

  connection.query(sql, function (err, results, fields) {
    if (results) {
      var lengthdata = results.length;
      ////console.log(results);
      res.status(200).json({ status: true, lengthdata: lengthdata, reeor });
    } else {
      res.json({ status: false, message: err });
      return;
    }
  });
});

app.get("/Pagination", jsonParser, function (req, res, next) {
  const page = req.query.page;
  const per_page = req.query.per_page;
  const sort_colum = req.query.sort_colum;
  const sort_direction = req.query.sort_direction;
  const search = req.query.search;

  const start_idx = (page - 1) * per_page;
  var params = [];
  var sql = "SELECT * FROM repair_information ";
  if (search) {
    sql += " WHERE date_repair LIKE ? ";
    params.push("%" + search + "%");
  }
  if (sort_colum) {
    sql += "ORDER BY " + sort_colum + " " + sort_direction;
  }
  sql += " LIMIT ?,? ";
  params.push(start_idx);
  params.push(per_page);

  connection.execute(sql, params, function (err, results, fields) {
    ////console.log(results);
    res.json({ status: true, results: results });
  });
});

//function Get_information

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //function recipient

app.post("/add_recipient", jsonParser, function (req, res, next) {
  connection.query(
    "INSERT INTO `recipient_name` (recipients,positions,phone,email) VALUES (?,?,?,?)",
    [req.body.recipients, req.body.positions, req.body.phone, req.body.email],
    function (err, results, fields) {
      if (err) {
        res.json({ status: false, message: err });
        ////console.log(results);
        return;
      }
      res.json({ status: true });
    }
  );
});

app.delete("/delete_recipient/:id", jsonParser, function (req, res, next) {
  const { id } = req.params;
  connection.query(
    `DELETE FROM recipient_name WHERE recipient_id = ${id}`,
    [id],
    function (err, results, fields) {
      if (err) {
        res.json({ status: false, message: err });
        return;
      }
      res.json({
        status: "ok",
        results: "Deleteted Sucsess!!",
      });
    }
  );
});

app.put("/edit_recipient/:id", jsonParser, function (req, res, next) {
  let id = req.params.id;
  const data = {
    recipients: req.body.recipients,
    positions: req.body.positions,
    phone: req.body.phone,
    email: req.body.email,
  };
  connection.query(
    `UPDATE recipient_name SET ? WHERE recipient_id = ${id}`,
    [data],
    function (err, results, fields) {
      if (err) {
        res.json({ status: false, message: err });
        return;
      }
      //console.log(results);
      res.json({
        status: "ok",
        results: "Updated Sucsess!!",
        state: true,
      });
    }
  );
});

app.get("/Getall_recipient", jsonParser, function (req, res, next) {
  connection.query(
    `SELECT recipients,positions FROM recipient_name `,
    function (err, results, fields) {
      if (results) {
        res.status(200).json({ staus: "ok", results });
      } else {
        res.json({ status: false, message: err });
        return;
      }
    }
  );
});

app.get("/all_recipient", jsonParser, function (req, res, next) {
  connection.query(
    `SELECT * FROM recipient_name `,
    function (err, results, fields) {
      if (results) {
        var lengthdata = results.length;
        res.status(200).json({ status: true, lengthdata: lengthdata, results });
      } else {
        res.json({ status: false, message: err });
        return;
      }
    }
  );
});

// END code function recipient

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// state code

app.get("/state/:?", jsonParser, function (req, res, next) {
  var stauss = req.query.staus;
  var sql = `SELECT * FROM repair_information WHERE staus = "${stauss}"`;

  connection.query(sql, function (err, results, fields) {
    if (results) {
      var lengthdata = results.length;
      if (lengthdata == 0) {
        res.json({ status: false, lengthdata });
      } else {
        res.json({ status: true, lengthdata });
      }
    } else {
      res.json({ status: "error", message: err });
      return;
    }
  });
});

// End state code

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// End code function

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// test cod

// end test code

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//port
app.listen(5009, () => {
  console.log("Runing Post 5009...");
});
//End code port

module.exports = app;
