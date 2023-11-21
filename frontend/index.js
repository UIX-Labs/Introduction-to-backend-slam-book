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
  const req = await fetch("http://localhost:8000/slambook", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors",
    body: JSON.stringify(newSlam), // body data type must match "Content-Type" header
  });
  const data = response.json(); // parses JSON response into native JavaScript objects
  //write your post request above

  showSlamList();
});
//Write your code above

async function showSlamList() {
  //Write your get request below and save the slam in allSlams
  const response = await fetch("http://localhost:8000/slambook", {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
  });

  const data = await response.json();
  //Write your get request above

  const ans = data.map((slam) => {
    return `<div class="card">

<p>My name in your contact is <span class="answer">${slam.nameInYourContact}</span></p>

<p>Relationship between us is <span class="answer">${slam.relationship}</span></p>

<p>Something you like in me is <span class="answer">${slam.somethingYouLikeInMe}</span></p>

<p>Something you hate in me is <span class="answer">${slam.somethingYouHateInMe}</span></p>

<p>If I die what would be your reaction?</p>

<p><span class="answer">${slam.ifIDieYourReaction}</span></p>

<p>What did you feel when you first saw me?</p>

<p><span class="answer">${slam.whatDidYouFeelWhenYouFirstSawMe}</span></p>

<p>A beautiful message for me?</p>

<p><span class="answer">${slam.beutifulMessageForMe}</span></p>

<p>A nickname for me is <span class="answer">${slam.nickNameForMe}</span></p>

<p>A song you want to dedicate to me is <span class="answer">${slam.songDedicatedToMe}</span></p>

<p>Can I share your opinion in my status?</p>

<p><span class="answer">${slam.canIShare}</span></p>
<button onClick="onDelete('${slam._id}')" >Delete</button>
</div>
`;
  });

  const allSlams = document.getElementsByClassName("allSlams");
  allSlams[0].innerHTML = ans;
}

const onDelete = async (index) => {
  //Write your delete query below
  const response = await fetch(`http://localhost:8000/slambook/${index}`, {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
  });
  //Write your delete query above
  showSlamList();
};

showSlamList();
