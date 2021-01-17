const csv = require('csvtojson');
const Member = require('../src/models/member');

// Regex to capture each part the grad sem year column
// Ex: "Fall 2020 (Freshman)" captures "Fall", "2020", "Freshman"
const REGEX_GRAD_SEM_YEAR = /([A-Za-z]+)\s([0-9]+)\s+\(([A-Za-z\s+]+)\)/;
const REGEX_GENERATION_YEAR = /([A-Za-z]+)\s([0-9]+)/;

// Download the CSV file onto your machine and use abs path
const csvFilePath='C:\\Users\\mattw\\Downloads\\FA20Membership.csv';

// These are the columns that requie special processing. I.e. the data can't be directly copy and pasted
const SPECIAL_COLUMNS_ENUM = {
    NAME: "NAME",
    GRAD_SEM_YEAR: "GRAD_SEM_YEAR",
    GENERATION: "GENERATION",
    BIRTHDATE: "BIRTHDATE",
    DUES: "DUES",
}

// These are the columns that are an enum value. Formatting is done to ensure they meet the backend options.
const ENUM_COLUMNS_ENUM = {
    LOCATION: "location",
    ROLE: "role",
    LEVEL: "level",
    STATUS: "status",
}

// The names of the columns in order from left to right. Name each column according to it's DB field name except for special fields
const columns = [SPECIAL_COLUMNS_ENUM.NAME, 'email', 'phone', 'netID', 'UIN', 'major', SPECIAL_COLUMNS_ENUM.BIRTHDATE,
                'github', 'snapchat', 'instagram', SPECIAL_COLUMNS_ENUM.GRAD_SEM_YEAR, SPECIAL_COLUMNS_ENUM.GENERATION, 
                ENUM_COLUMNS_ENUM.LOCATION, ENUM_COLUMNS_ENUM.ROLE, ENUM_COLUMNS_ENUM.LEVEL, ENUM_COLUMNS_ENUM.STATUS, SPECIAL_COLUMNS_ENUM.DUES];
const specialColumns = Object.values(SPECIAL_COLUMNS_ENUM);
const enumColumns = Object.values(ENUM_COLUMNS_ENUM);

async function main() {
    // Data is array of JSON objects, where each key is field1, field2, ..., field19.
    const sheetData = await csv({ noheader: true }).fromFile(csvFilePath);

    // Remove the header row
    sheetData.shift();
    sheetData.forEach(memberJSON => saveJSONIntoDB(memberJSON));
}

function saveJSONIntoDB(memberJSON) {
    try {
        const model = createModelFromJSON(memberJSON);
        Member.create(model);
    } catch (error) {
        console.log(`Could not add member to database. \n Error: ${error} \n Data: ${memberJSON}`);
    }
}

function createModelFromJSON(memberJSON) {
    const memberObj = {};

    for (let i = 0; i < columns.length; i++) {
        const fieldLabel = `field${ i + 1}`;
        if (specialColumns.includes(columns[i])) {
            processSpecialField(memberObj, columns[i], memberJSON[fieldLabel]);
        } else if (enumColumns.includes(columns[i])) {
            processEnumField(memberObj, columns[i], memberJSON[fieldLabel]);
        } else {
            processSimpleField(memberObj, columns[i], memberJSON[fieldLabel]);
        }
    }

    return memberObj;
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
        case SPECIAL_COLUMNS_ENUM.BIRTHDATE:
            processBirthdate(memberObj, fieldValue);
            break;
        case SPECIAL_COLUMNS_ENUM.DUES:
            processDues(memberObj, fieldValue);
            break;
    }
}

/**
 * The spreadsheet stores name as one field, yet the DB stores first and last. We need
 * to split the name so it can be stored in the DB. 
 */
function processName(memberObj, nameValue) {
    const nameComponents = nameValue.split(" ");
    if (nameComponents.length != 2)
        throw `${nameValue}, has an unparsable name. They must be entered manually.`;

    [ memberObj['firstName'], memberObj['lastName'] ] = nameComponents;
}

/**
 * This field contains class standing, grad year, and grad month
 */
function prcoessGradSemYear(memberObj, gradSemYearValue) {
    let match = gradSemYearValue.match(REGEX_GRAD_SEM_YEAR) 
    if (!match || match.length != 4)
        throw `Could not parse Grad Semester/Year column (${gradSemYearValue}).`;

    match = match.slice(1, 4);
    [ memberObj['gradSemester'], memberObj['gradYear'], memberObj['classStanding'] ] = formatEnumFields(match);
}

function processGeneration(memberObj, generationValue) {
    let match = generationValue.match(REGEX_GENERATION_YEAR);
    if (!match || match.length != 3)
        throw `Could not parse Generation Year column (${generationValue}).`;

    match = match.slice(1, 3);
    [ memberObj['generationSemester'], memberObj['generationYear'] ] = formatEnumFields(match);
}

function processBirthdate(memberObj, birthdateValue) {
    memberObj['birthdate'] = Date.parse(birthdateValue);
}

function processEnumField(memberObj, fieldName, enumValue) {
    memberObj[fieldName] = formatEnumField(enumValue)
}

/**
 * Formats the enum fields as follows: 
 *     - Replace spaces and dashes with underscores
 *     - Captialize entire string
 */
function formatEnumField(enumValue) {
    let underscoredValue = enumValue.replace(/-|\s/ , "_");
    return underscoredValue.toUpperCase();
}

function formatEnumFields(enumValues) {
    return enumValues.map(val => formatEnumField(val));
}

function processDues(memberObj, duesValue) {
    memberObj['areDuesPaid'] = ["Y", "YES", "T", "TRUE"].includes(duesValue.toUpperCase());
}

main();
