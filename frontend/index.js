let form;
let allSlamArray = [];
form = document.querySelectorAll("form")[0];

// Add the evenlistner below
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const contactName = document.getElementsByName("contactName")[0].value;
  const relationship = document.getElementsByName("relationship")[0].value;
  const likeInMe = document.getElementsByName("likeInMe")[0].value;
  const hateInMe = document.getElementsByName("hateInMe")[0].value;
  const deadReaction = document.getElementsByName("deadReaction")[0].value;
  const firstImpression =
    document.getElementsByName("firstImpression")[0].value;
  const beautifulMessage =
    document.getElementsByName("beautifulMessage")[0].value;
  const nickname = document.getElementsByName("nickname")[0].value;
  const songForMe = document.getElementsByName("songForMe")[0].value;
  const shareOpinion = document.getElementsByName("shareOpinion")[0].value;

  const newSlam = {
    nameInYourContact: contactName,
    relationship: relationship,
    somethingYouLikeInMe: likeInMe,
    somethingYouHateInMe: hateInMe,
    ifIDieYourReaction: deadReaction,
    whatDidYouFeelWhenYouFirstSawMe: firstImpression,
    beutifulMessageForMe: beautifulMessage,
    nickNameForMe: nickname,
    songDedicatedToMe: songForMe,
    canIShare: shareOpinion,
  };

  // write your post request below
  const req= await fetch("http://0.0.0.0:8000/", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify(newSlam), // body data type must match "Content-Type" header
  });
  const data = response.json(); // parses JSON response into native JavaScript objects
  //write your post request above

  showSlamList();
});
//Write your code above

async function showSlamList() {
  //Write your get request below and save the slam in allSlams
  const req= await fetch("http://0.0.0.0:8000/", {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
  });
  //Write your get request above

  const ans = allSlamArray.map((slam) => {
    return `<div class="card">

<p>My name in your contact is <span class="answer">${slam.contactName}</span></p>

<p>Relationship between us is <span class="answer">${slam.relationship}</span></p>

<p>Something you like in me is <span class="answer">${slam.likeInMe}</span></p>

<p>Something you hate in me is <span class="answer">${slam.hateInMe}</span></p>

<p>If I die what would be your reaction?</p>

<p><span class="answer">${slam.deadReaction}</span></p>

<p>What did you feel when you first saw me?</p>

<p><span class="answer">${slam.firstImpression}</span></p>

<p>A beautiful message for me?</p>

<p><span class="answer">${slam.beautifulMessage}</span></p>

<p>A nickname for me is <span class="answer">${slam.nickname}</span></p>

<p>A song you want to dedicate to me is <span class="answer">${slam.songForMe}</span></p>

<p>Can I share your opinion in my status?</p>

<p><span class="answer">${slam.shareOpinion}</span></p>
<button onClick= >Delete</button>
`;
  });

  const allSlams = document.getElementsByClassName("allSlams")[0];
  allSlams.innerHTML=ans;
}

showSlamList();
