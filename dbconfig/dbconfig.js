module.exports = function (mongoose) { 
    mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>{ console.log(`connection to database established`)});
}