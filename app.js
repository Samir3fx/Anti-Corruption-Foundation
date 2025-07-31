const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();

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
