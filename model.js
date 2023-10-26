const mongoose = require('mongoose');


const slambookSchema = new mongoose.Schema({
    nameInYourContact: String,
    relationship: String,
    somethingYouLikeInMe: String,
    somethingYouHateInMe: String,
    ifIDieYourReaction: String,
    whatDidYouFeelWhenYouFirstSawMe: String,
    beutifulMessageForMe: String,
    nickNameForMe: String,
    songDedicatedToMe: String,
    canIShare: String,
    yourName: String
  });
  
  const SlamBook = mongoose.model('SlamBook', slambookSchema);

  module.exports = SlamBook;
