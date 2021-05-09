const openpgp = require('openpgp');
const { generateEncryptionPasswords } = require('./members');

// encrypt a note with AES 256 encryption
const encryptNote = async (data) => {
  const viewerIds = [
    ...data.metaData.access.editableBy,
    ...data.metaData.access.viewableBy,
  ];

  const uniqueViewerIds = [...new Set(viewerIds)];
  const passwords = await generateEncryptionPasswords(uniqueViewerIds);

  const message = await openpgp.createMessage({
    text: data.content.toString(),
  });
  const encrypted = await openpgp.encrypt({
    message,
    passwords,
    config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib }, // compress with zlib
  });
  return encrypted;
};

// decrypt a note with AES 256 encryption
const decryptNote = async (encryptedNote, encryptionPassword) => {
  const encryptedMessage = await openpgp.readMessage({
    armoredMessage: encryptedNote, // parse encrypted bytes
  });
  const { data: decrypted } = await openpgp.decrypt({
    message: encryptedMessage,
    passwords: [encryptionPassword], // decrypt with password
  });
  return decrypted;
};

module.exports = {
  encryptNote,
  decryptNote,
};
