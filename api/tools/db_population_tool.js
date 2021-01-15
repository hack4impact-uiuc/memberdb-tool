const csv = require('csvtojson');

// Download the CSV file onto your machine and use abs path
const csvFilePath='C:\\Users\\mattw\\Downloads\\FA20Membership.csv';

// These are the columns that requie special processing. I.e. the data can't be directly copy and pasted
const SPECIAL_COLUMNS_ENUM = {
    NAME: "NAME",
    GRAD_SEM_YEAR: "GRAD_SEM_YEAR",
    GENERATION: "GENERATION",
    BIRTHDATE: "BIRTHDATE",
}

// The names of the columns in order from left to right. Name each column according to it's DB field name except for special fields
const columns = [SPECIAL_COLUMNS_ENUM.NAME, 'email', 'phoneNumber', 'netID', 'UIN', 'major', SPECIAL_COLUMNS_ENUM.BIRTHDATE,
                'github', 'snapchat', 'instagram', SPECIAL_COLUMNS_ENUM.GRAD_SEM_YEAR, SPECIAL_COLUMNS_ENUM.GENERATION, 
                'location', 'role', 'level', 'status', 'dues'];
const specialColumns = Object.values(SPECIAL_COLUMNS_ENUM);

async function main() {
    // Data is array of JSON objects, where each key is field1, field2, ..., field19.
    const sheetData = await csv({ noheader: true }).fromFile(csvFilePath);
    sheetData.forEach(memberJSON => saveJSONIntoDB(memberJSON));
}

function saveJSONIntoDB(memberJSON) {
   const model = createModelFromJSON(memberJSON);
}

function createModelFromJSON(memberJSON) {
    const memberObj = {};

    for (let i = 0; i < columns.length; i++) {
        const fieldLabel = `field${i}`;
        if (specialColumns.includes(columns[i])) {
            processSpecialField(memberObj, columns[i], memberJSON[fieldLabel]);
        } else {
            processSimpleField(memberObj, columns[i], memberJSON[fieldLabel]);
        }
    }
}

function processSimpleField(memberObj, fieldName, fieldValue) {
    memberObj[fieldName] = fieldValue;
}

function processSpecialField(memberObj, fieldName, fieldValue) {
    switch(fieldName) {
        case SPECIAL_COLUMNS_ENUM.NAME:
            processName(memberObj, fieldValue);
            break;
        case SPECIAL_COLUMNS_ENUM.GRAD_SEM_YEAR:
                prcoessGradSemYear(memberObj, fieldValue);
                break;
        case SPECIAL_COLUMNS_ENUM.GENERATION:
            processGeneration(memberObj, fieldValue);
            break;
    }
}

/**
 * The spreadsheet stores name as one field, yet the DB stores first and last. We need
 * to split the name so it can be stored in the DB. 
 */
function processName(memberObj, nameValue) {
    const nameComponents = nameValue.split("\\s+");
    if (nameComponents.length != 2)
        throw `${nameValue}, has an unparsable name. They must be entered manually.`;

    memberObj['firstName'] = nameComponents[0];
    memberObj['lastName'] = nameComponents[1];
}

/**
 * This field contains class standing, grad year, and grad month
 */
function prcoessGradSemYear(memberObj, nameValue) {
    
}

function processGeneration(memberObj, nameValue) {

}

main();
