let countriesStates = null;
let countriesStatesMap = null;

window.onload = () => {
  buildCountryDropdown();
}

// -----------------------------------------------------------------------
const getCountryStates = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json"
  );
  const countriesStates = await response.text();

  return countriesStates;
};

//Fetch country and state data
const buildCountryDropdown = async () => {
  countriesStates = await getCountryStates();
  countriesStates = JSON.parse(countriesStates);

  countriesStatesMap = {};
 
  for (let i = 0; i < countriesStates.length; i++) {
    countriesStatesMap[countriesStates[i].name] = countriesStates[i].states;
  }

  const countriesArr = Object.keys(countriesStatesMap);


  // Select dropdown component and add the countries as subitems
  const countryDropdown = document.querySelector(".country #in");

  for (let i = 0; i < countriesArr.length; i++) {
    const option = document.createElement("option");
    option.text = countriesArr[i];
    option.value = countriesArr[i];
    countryDropdown.appendChild(option);
  }
};

const buildStateDropdown = async () => {
  let countryDropdown = document.querySelector(".country #in");
  let selectedCountry = countryDropdown.value;
  // console.log(countriesStatesMap);
  // console.log(selectedCountry);

  let stateArr = countriesStatesMap[selectedCountry];
  // console.log(stateArr);

  
  let stateDropdown = document.querySelector(".state #in");
  stateDropdown.innerHTML = '<option hidden value=""></option>';

  for (let i = 0; i < stateArr.length; i++) {
    const option = document.createElement("option");
    option.text = stateArr[i].name;
    option.value = stateArr[i].code;
    stateDropdown.appendChild(option);
  }
};

const onSubmit = async () => {
  // Field Values
  const name = document.querySelector(".nameArea #in").value;
  const dob = document.querySelector(".dob #in").value;
  const contact = document.querySelector(".ContactNoArea #in").value;
  const country = document.querySelector(".country #in").value;
  const state = document.querySelector(".state #in").value;
  const email = document.querySelector(".email #in").value;

  let messageElement = parent.document.getElementById("message");

  // Validation Checks ---------------------------

  // 
  let response = await fetch('./validation-settings.json');
  let validators = await response.json();
  validators = validators.validators;
  
  let validatorMap = {};

  validators.map(obj => {
    validatorMap[obj.field] = obj.validator[0];
  });
  // console.log(validatorMap);

  // Check Country, State, Name are not empty ----
  if (validatorMap.name.required && !name) {
    return messageElement.innerHTML = '{"Name": {"error": "Name cannot be empty."}}';
  }
  if (validatorMap.country.required && !country) {
    return messageElement.innerHTML = '{"Country": {"error": "Country cannot be empty."}}';
  }
  if (validatorMap.state.required && !state) {
    return messageElement.innerHTML = '{"State": {"error": "State cannot be empty."}}';
  }

  // Name Check
  if (validatorMap.name.required && !(4 <= name.length && name.length <= 10)) {
    return messageElement.innerHTML = '{"Name": {"error": "Length should be in between 4-10 characters."}}';
  }

  // Email Check
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (validatorMap.email.required && !(emailRegex.test(email))) {
    return messageElement.innerHTML = '{"Email": {"error": "Email is not valid."}}';
  }

  // Contact Number check
  const contactNumberRegex = /^\d{10}$/;
  if (validatorMap.contact_number.required && !(contactNumberRegex.test(contact))) {
    return messageElement.innerHTML = '{"Contact Number": {"error": "Contact number is not valid."}}';
  }

  // Print the success message in page -----------
  return messageElement.innerHTML = '{"Success":"All fields are valid."}';
};
