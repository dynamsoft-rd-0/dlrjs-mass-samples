export function createPendingPromise() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
 
  return { promise, resolve, reject };
}

export function getNeedShowFields(result) {
  const parseResultInfo = {};
  if (!result.exception) {
    let name = result.getFieldValue("name");
    parseResultInfo['Name'] = name;

    let gender = result.getFieldValue("sex");
    parseResultInfo["Gender"] = gender;

    let birthYear = result.getFieldValue("birthYear");
    let birthMonth = result.getFieldValue("birthMonth");
    let birthDay = result.getFieldValue("birthDay");
    if (parseInt(birthYear) > (new Date().getFullYear() % 100)) {
      birthYear = "19" + birthYear;
    } else {
      birthYear = "20" + birthYear;
    }
    let age = new Date().getUTCFullYear() - parseInt(birthYear);
    parseResultInfo["Age"] = age;

    let documentNumber = result.getFieldValue("passportNumber");
    parseResultInfo['Document Number'] = documentNumber;

    let issuingState = result.getFieldValue("issuingState");
    parseResultInfo['Issuing State'] = issuingState;

    let nationality = result.getFieldValue("nationality");
    parseResultInfo['Nationality'] = nationality;

    parseResultInfo['Date of Birth (YYYY-MM-DD)'] = birthYear + "-" + birthMonth + "-" + birthDay;

    let expiryYear = result.getFieldValue("expiryYear");
    let expiryMonth = result.getFieldValue("expiryMonth");
    let expiryDay = result.getFieldValue("expiryDay");
    if (parseInt(expiryYear) >= 60) {
      expiryYear = "19" + expiryYear;
    } else {
      expiryYear = "20" + expiryYear;
    }
    parseResultInfo["Date of Expiry (YYYY-MM-DD)"] = expiryYear + "-" + expiryMonth + "-" + expiryDay;

    let personalNumber = result.getFieldValue("personalNumber");
    parseResultInfo["Personal Number"] = personalNumber;

    let primaryIdentifier = result.getFieldValue("primaryIdentifier");
    parseResultInfo["Primary Identifier(s)"] = primaryIdentifier;

    let secondaryIdentifier = result.getFieldValue("secondaryIdentifier");
    parseResultInfo["Secondary Identifier(s)"] = secondaryIdentifier;
  }
  return parseResultInfo;
}