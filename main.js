const tbody = document.getElementById("tbody");
const inputName = document.getElementById("name");
const inputContact = document.getElementById("contact");
const inputTitle = document.getElementById("title");
const add = document.getElementById("add");
const updateBtn = document.getElementById("update");
const url = "https://northwind.vercel.app/api/suppliers";

async function getMethod() {
  add.style.display = "block ";
  updateBtn.style.display = "none";
  await axios.get(url).then((res) =>
    res.data.forEach((e) => {
      fillTable(e);
    })
  );
}

getMethod();

add.addEventListener("click", () => {
  postMethod();
  inputContact.value = "";
  inputName.value = "";
  inputTitle.value = "";
});

let id;

function fillTable(element) {
  let tr = document.createElement("tr");
  let Id = document.createElement("td");
  Id.innerHTML = element.id;
  let companyName = document.createElement("td");
  companyName.innerHTML = element.companyName;
  let contactName = document.createElement("td");
  contactName.innerHTML = element.contactName;
  let contactTitle = document.createElement("td");
  contactTitle.innerHTML = element.contactTitle;
  let buttonDelete = document.createElement("button");
  buttonDelete.setAttribute("id", element.id);
  buttonDelete.innerHTML = "Delete";
  let buttonUpdate = document.createElement("button");
  buttonUpdate.innerHTML = "Update";
  buttonUpdate.setAttribute("id", element.id);

  tr.appendChild(Id);
  tr.appendChild(companyName);
  tr.appendChild(contactName);
  tr.appendChild(contactTitle);
  tr.appendChild(buttonDelete);
  tr.appendChild(buttonUpdate);
  tbody.appendChild(tr);

  buttonDelete.addEventListener("click", () => {
    let id = buttonDelete.getAttribute("id");
    deleteMethod(id);
  });

  //this is update button of 'tr' and here I send ID to the top variable and then catch it in main update button
  buttonUpdate.addEventListener("click", function (e) {
    add.style.display = "none ";
    updateBtn.style.display = "block";
    id = buttonUpdate.getAttribute("id");
    let trElement = e.target.parentNode;
    let tdEl = trElement.getElementsByTagName("td");
    for (let i = 0; i < tdEl.length; i++) {
      inputName.value = tdEl[1].innerHTML;
      inputContact.value = tdEl[2].innerHTML;
      inputTitle.value = tdEl[3].innerHTML;
    }
  });
}

//this is main update button which call putMethod
updateBtn.addEventListener("click", () => {
  if (inputName.value == "") {
    alert("Fill All Inputs");
    return;
  } else if (inputContact.value == "") {
    alert("Fill All Inputs");

    return;
  } else if (inputTitle.value == "") {
    alert("Fill All Inputs");

    return;
  }
  const newObject = {
    companyName: inputName.value,
    contactName: inputContact.value,
    contactTitle: inputTitle.value,
  };
  putMethod(id, newObject);
  inputContact.value = "";
  inputName.value = "";
  inputTitle.value = "";
});

function putMethod(id, newData) {
  tbody.innerHTML = "";
  axios({
    url: `${url}/${id}`,
    method: "PUT",
    data: newData,
  }).then(() => getMethod());
}

function deleteMethod(id) {
  tbody.innerHTML = "";
  axios.delete(url + "/" + id).then((res) => {
    if (res.status == 200) {
      getMethod();
    }
  });
}

function postMethod() {
  if (inputName.value == "") {
    alert("Fill All Inputs");
    return;
  } else if (inputContact.value == "") {
    alert("Fill All Inputs");

    return;
  } else if (inputTitle.value == "") {
    alert("Fill All Inputs");

    return;
  }
  const newObject = {
    companyName: inputName.value,
    contactName: inputContact.value,
    contactTitle: inputTitle.value,
  };
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newObject),
  }).then(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((element) => {
          fillTable(element);
        });
      });
  });
}
