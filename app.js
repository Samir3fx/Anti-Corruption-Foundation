const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
//models
const Contact = require('./models/ContactModel');
const Complaint = require('./models/ComplaintModel');
const Membership = require('./models/Membershipmodels');
const News = require('./models/News');
const Event = require('./models/Event');
const Gallery= require('./models/GalleryModels');
const Cashresolved=require('./models/caseresolved');
// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/AntiCorruption', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => console.log('MongoDB Connected'));

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('html', hbs.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.static(path.join(__dirname, 'public')));

// Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });



// Routes
app.get('/', (req, res) => {
  res.render('index');  
});
app.get('/about',(req,res)=>{
    res.render('about')
});
app.get('/about_director',(req,res)=>{
    res.render('about_director')
});
app.get('/service',(req,res)=>{
    res.render('service')
});
app.get('/gallery',(req,res)=>{
    res.render('gallery')
});
app.get('/News&Event',(req,res)=>{
    res.render('News&Event')
});
app.get('/Online_Membership',(req,res)=>{
    res.render('Online_Membership')
});
app.get('/National_List',(req,res)=>{
    res.render('National_List')
});
app.get('/State_List',(req,res)=>{
    res.render('State_List')
});
app.get('/dist_list',(req,res)=>{
    res.render('dist_list')
});
app.get('/Block_List',(req,res)=>{
    res.render('Block_List')
});
app.get('/complain',(req,res)=>{
    res.render('complain')
});
app.get('/case_resolved',(req,res)=>{
    res.render('case_resolved')
});
app.get('/legal',(req,res)=>{
    res.render('legal')
});
app.get('/contact',(req,res)=>{
    res.render('contact')
});



// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

//contact
app.post('/submit-form', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const contact = new Contact({ name, email, phone, subject, message });
    await contact.save();
    res.redirect('/contact?status=success');
  } catch (err) {
    console.log(err);
    res.redirect('/contact?status=error');
  }
});
// Submit complaint
app.post('/submit-complaint', upload.single('image'), async (req, res) => {
  try {
    const complaintNo = 'CMP' + Date.now();

    const complaint = new Complaint({
      name: req.body.name,
      father_spouse_name: req.body.father_spouse_name,
      gender: req.body.gender,
      dob: req.body.dob,
      email: req.body.email,
      mobile: req.body.mobile,
      image: req.file ? '/uploads/' + req.file.filename : '',
      address: req.body.address,
      complain: req.body.complain,
      complaintNo: complaintNo
    });

    await complaint.save();
    res.json({ success: true, complaintNo: complaintNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});
//membership
// POST route
app.post('/submit-membership', upload.single('image'), async (req, res) => {
  try {
    const enrollmentNo = 'ENR' + Math.floor(1000000000 + Math.random() * 9000000000);

    const member = new Membership({
      name: req.body.name,
      father_spouse_name: req.body.father_spouse_name,
      gender: req.body.gender,
      dob: req.body.dob,
      email: req.body.email,
      mobile: req.body.mobile,
      aadhar: req.body.aadhar,
      image: req.file ? '/uploads/' + req.file.filename : '',
      member: req.body.member,
      amount: req.body.amount,
      address: req.body.address,
      enrollmentNo: enrollmentNo
    });

    await member.save();

   res.redirect(`/Online_Membership?enrollmentNo=${enrollmentNo}`);

  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'dashboard.html'));
});

// GET Dashboard
app.get('/views/admin/Admin_News', async (req, res) => {
  const newsList = await News.find().sort({ createdAt: -1 });
  res.render('admin/Admin_News', { newsList });
});

// INSERT News
app.post('/insert-news', upload.single('image'), async (req, res) => {
  const imageurl = req.file ? `/uploads/${req.file.filename}` : '';
  await News.create({
    title: req.body.title,
    publishby: req.body.publishby,
    imageurl,
  });
  res.redirect('/views/admin/Admin_News');
});

// UPDATE News
app.post('/update-news/:id', upload.single('image'), async (req, res) => {
  const news = await News.findById(req.params.id);
  news.title = req.body.title;
  news.publishby = req.body.publishby;

  if (req.file) {
    news.imageurl = `/uploads/${req.file.filename}`;
  }

  await news.save();
  res.redirect('/views/admin/Admin_News');
});

// DELETE News
app.get('/delete-news/:id', async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.redirect('/views/admin/Admin_News');
});

// GET Event Page
app.get('/admin/Admin_Event', async (req, res) => {
  const eventList = await Event.find().sort({ createdAt: -1 });
  res.render('admin/Admin_Event', { eventList });
});

// INSERT Event
app.post('/insert-event', upload.single('image'), async (req, res) => {
  const imageurl = req.file ? `/uploads/${req.file.filename}` : '';
  await Event.create({
    title: req.body.title,
    publishby: req.body.publishby,
    imageurl,
  });
  res.redirect('/admin/Admin_Event');
});

// UPDATE Event
app.post('/update-event/:id', upload.single('image'), async (req, res) => {
  const event = await Event.findById(req.params.id);
  event.title = req.body.title;
  event.publishby = req.body.publishby;

  if (req.file) {
    event.imageurl = `/uploads/${req.file.filename}`;
  }

  await event.save();
  res.redirect('/admin/Admin_Event');
});

// DELETE Event
app.get('/delete-event/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.redirect('/admin/Admin_Event');
});


// GET Gallery Page
app.get('/admin/Admin_Gallery', async (req, res) => {
  const galleryList = await Gallery.find().sort({ createdAt: -1 });
  res.render('admin/Admin_Gallery', { galleryList });
});

// INSERT gallery
app.post('/insert-gallery', upload.single('image'), async (req, res) => {
  const imageurl = req.file ? `/uploads/${req.file.filename}` : '';
  await Gallery.create({
    title: req.body.title,
    publishby: req.body.publishby,
    imageurl,
  });
  res.redirect('/admin/Admin_Gallery');
});

// UPDATE gallery
app.post('/update-gallery/:id', upload.single('image'), async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);
  gallery.title = req.body.title;
  gallery.publishby = req.body.publishby;

  if (req.file) {
    gallery.imageurl = `/uploads/${req.file.filename}`;
  }

  await gallery.save();
  res.redirect('/admin/Admin_Gallery');
});

// DELETE gallery
app.get('/delete-gallery/:id', async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.redirect('/admin/Admin_Gallery');
});

// Show All Memberships
app.get('/admin/AddMembership_list', async (req, res) => {
  const membershipList = await Membership.find().sort({ createdAt: -1 });
 res.render('admin/AddMembership_list', { membershipList });

});

// Update Membership
app.post('/update-membership/:id', upload.single('image'), async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) return res.status(404).send("Not Found");

    // Update fields
    member.name = req.body.name;
    member.father_spouse_name = req.body.father_spouse_name;
    member.gender = req.body.gender;
    member.dob = req.body.dob;
    member.email = req.body.email;
    member.mobile = req.body.mobile;
    member.aadhar = req.body.aadhar;
    member.member = req.body.member;
    member.amount = req.body.amount;
    member.enrollmentNo = req.body.enrollmentNo;

    if (req.file) {
      member.image = '/uploads/' + req.file.filename;
    }

    await member.save();
    res.redirect('/admin/AddMembership_list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete Membership
app.get('/delete-membership/:id', async (req, res) => {
  await Membership.findByIdAndDelete(req.params.id);
  res.redirect('/admin/AddMembership_list');
});


// Show All Memberships where member is "Block"
app.get('/admin/Admin_Blocklist', async (req, res) => {
  try {
    const membershipList = await Membership.find({ member: 'Block' }).sort({ createdAt: -1 });
    res.render('admin/Admin_Blocklist', { membershipList });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Update Membership
app.post('/update-membership/:id', upload.single('image'), async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) return res.status(404).send("Not Found");

    // Update fields
    member.name = req.body.name;
    member.father_spouse_name = req.body.father_spouse_name;
    member.gender = req.body.gender;
    member.dob = req.body.dob;
    member.email = req.body.email;
    member.mobile = req.body.mobile;
    member.aadhar = req.body.aadhar;
    member.member = req.body.member;
    member.amount = req.body.amount;
    member.enrollmentNo = req.body.enrollmentNo;

    if (req.file) {
      member.image = '/uploads/' + req.file.filename;
    }

    await member.save();
    res.redirect('/admin/Admin_Blocklist');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete Membership
app.get('/delete-membership/:id', async (req, res) => {
  await Membership.findByIdAndDelete(req.params.id);
  res.redirect('/admin/Admin_Blocklist');
});


// Show All Memberships where member is "Dist"
app.get('/admin/Admin_Districtlist', async (req, res) => {
  try {
    const membershipList = await Membership.find({ member: 'Dist' }).sort({ createdAt: -1 });
    res.render('admin/Admin_Districtlist', { membershipList });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Update Membership
app.post('/update-membership/:id', upload.single('image'), async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) return res.status(404).send("Not Found");

    // Update fields
    member.name = req.body.name;
    member.father_spouse_name = req.body.father_spouse_name;
    member.gender = req.body.gender;
    member.dob = req.body.dob;
    member.email = req.body.email;
    member.mobile = req.body.mobile;
    member.aadhar = req.body.aadhar;
    member.member = req.body.member;
    member.amount = req.body.amount;
    member.enrollmentNo = req.body.enrollmentNo;

    if (req.file) {
      member.image = '/uploads/' + req.file.filename;
    }

    await member.save();
    res.redirect('/admin/Admin_Districtlist');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete Membership
app.get('/delete-membership/:id', async (req, res) => {
  await Membership.findByIdAndDelete(req.params.id);
  res.redirect('/admin/Admin_Districtlist');
});



// Show All Memberships where member is "State"
app.get('/admin/Admin_Statelist', async (req, res) => {
  try {
    const membershipList = await Membership.find({ member: 'State' }).sort({ createdAt: -1 });
    res.render('admin/Admin_Statelist', { membershipList });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Update State List
app.post('/update-membership/:id', upload.single('image'), async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) return res.status(404).send("Not Found");

    // Update fields
    member.name = req.body.name;
    member.father_spouse_name = req.body.father_spouse_name;
    member.gender = req.body.gender;
    member.dob = req.body.dob;
    member.email = req.body.email;
    member.mobile = req.body.mobile;
    member.aadhar = req.body.aadhar;
    member.member = req.body.member;
    member.amount = req.body.amount;
    member.enrollmentNo = req.body.enrollmentNo;

    if (req.file) {
      member.image = '/uploads/' + req.file.filename;
    }

    await member.save();
    res.redirect('/admin/Admin_Statelist');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete State List
app.get('/delete-membership/:id', async (req, res) => {
  await Membership.findByIdAndDelete(req.params.id);
  res.redirect('/admin/Admin_Statelist');
});

// Show All Memberships where member is "National List"
app.get('/admin/Admin_NationalList', async (req, res) => {
  try {
    const membershipList = await Membership.find({ member: 'National' }).sort({ createdAt: -1 });
    res.render('admin/Admin_NationalList', { membershipList });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Update State List
app.post('/update-membership/:id', upload.single('image'), async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) return res.status(404).send("Not Found");

    // Update fields
    member.name = req.body.name;
    member.father_spouse_name = req.body.father_spouse_name;
    member.gender = req.body.gender;
    member.dob = req.body.dob;
    member.email = req.body.email;
    member.mobile = req.body.mobile;
    member.aadhar = req.body.aadhar;
    member.member = req.body.member;
    member.amount = req.body.amount;
    member.enrollmentNo = req.body.enrollmentNo;

    if (req.file) {
      member.image = '/uploads/' + req.file.filename;
    }

    await member.save();
    res.redirect('/admin/Admin_NationalList');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete State List
app.get('/delete-membership/:id', async (req, res) => {
  await Membership.findByIdAndDelete(req.params.id);
  res.redirect('/admin/Admin_NationalList');
});


// complain list
app.get('/admin/Admin_Complainlist', async (req, res) => {
  try {
    const ComplaintList = await Complaint.find().sort({ createdAt: -1 });
    res.render('admin/Admin_Complainlist', { ComplaintList });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Update complain
app.post('/update-complainlist/:id', upload.single('image'), async (req, res) => {
  try {
    const member = await Complaint.findById(req.params.id);
    if (!member) return res.status(404).send("Not Found");

    // Update fields
      member.name = req.body.name;
    member.father_spouse_name = req.body.father_spouse_name;
    member.gender = req.body.gender;
    member.dob = req.body.dob;
    member.email = req.body.email;
    member.mobile = req.body.mobile;
    member.address = req.body.address;
    member.complain = req.body.complain;
    member.amount = req.body.amount;
    member.complaintNo = req.body.complaintNo;
    member.status = req.body.status;
    if (req.file) {
      member.image = '/uploads/' + req.file.filename;
    }

    await member.save();
    res.redirect('/admin/Admin_Complainlist');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete complain list
app.get('/delete-complainlist/:id', async (req, res) => {
  await Complaint.findByIdAndDelete(req.params.id);
  res.redirect('/admin/Admin_Complainlist');
});

// contact list
app.get('/admin/Admin_Contactlist', async (req, res) => {
  try {
    const contactList = await Contact.find().sort({ createdAt: -1 });
    res.render('admin/Admin_Contactlist', { contactList });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Delete contact list
app.get('/delete-contact/:id', async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.redirect('/admin/Admin_Contactlist');
});


// GET Cash Resolved
app.get('/admin/Admin_CaseResolved', async (req, res) => {
  const cashresolved = await Cashresolved.find().sort({ createdAt: -1 });
  res.render('admin/Admin_CaseResolved', { cashresolved });
});

// INSERT caseresolved
app.post('/insert-resolved', upload.single('image'), async (req, res) => {
  const imageurl = req.file ? `/uploads/${req.file.filename}` : '';
  await Cashresolved.create({
    title: req.body.title,
    description: req.body.description,
    imageurl,
  });
  res.redirect('/admin/Admin_CaseResolved');
});

// UPDATE cashresolved
app.post('/update-resolved/:id', upload.single('image'), async (req, res) => {
  const cashresolved = await Cashresolved.findById(req.params.id);
  cashresolved.title = req.body.title;
  cashresolved.description = req.body.description;

  if (req.file) {
    cashresolved.imageurl = `/uploads/${req.file.filename}`;
  }

  await cashresolved.save();
  res.redirect('/admin/Admin_CaseResolved');
});

// DELETE cashresolved
app.get('/delete-resolved/:id', async (req, res) => {
  await Cashresolved.findByIdAndDelete(req.params.id);
  res.redirect('/admin/Admin_CaseResolved');
});