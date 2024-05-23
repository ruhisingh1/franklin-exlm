import { decorateIcons } from '../../scripts/lib-franklin.js';
import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';
import { defaultProfileClient, isSignedInUser } from '../../scripts/auth/profile.js';

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  /* eslint-disable-next-line no-console */
  console.error('Error fetching placeholders:', err);
}
const adobeAccountLink = 'https://account.adobe.com/';
const communityAccountLink = 'https://account.adobe.com/';

export default async function decorate(block) {
  let displayName = '';
  let company = '';
  let email = '';
  let profilePicture = '';

  const isSignedIn = await isSignedInUser();
  if (isSignedIn) {
    const profileData = await defaultProfileClient.getMergedProfile();
    displayName = profileData?.displayName || '';
    email = profileData?.email || '';
    const ppsProfileData = await defaultProfileClient.getPPSProfile();
    profilePicture = ppsProfileData?.images?.['100'] || '';
    company = ppsProfileData?.company || '';
  }

  const accountCardDOM = document.createRange().createContextualFragment(`
    <div class="adobe-account"><div class="card-header">
      <div class="my-adobe-account">${placeholders?.myAdobeAccount || 'My Adobe Account'}</div>
      <div class="manage-adobe-account">
        <span class="icon icon-new-tab"></span>
        <a href="${adobeAccountLink}" target="_blank">${placeholders?.manageAdobeAccount || 'Manage Adobe account'}</a>
      </div>
    </div>
    <div class="card-body">
      <div class="avatar">
        ${
          profilePicture
            ? `<img class="profile-picture" src="${profilePicture}" alt="profile picture" />`
            : '<span class="icon icon-profile"></span>'
        }
      </div>
      <div class="user-info">
        <div class="display-name">${displayName}</div>
        <div class="company">${company}</div>
        <div class="email">${email}</div>
      </div>
    </div></div>
    <div class="community-account"><div class="card-header">
    <div class="my-community-account">${placeholders?.myAdobeAccount || 'My Adobe Account'}</div>
    <div class="manage-community-account">
      <span class="icon icon-new-tab"></span>
      <a href="${communityAccountLink}" target="_blank">${placeholders?.updateProfile || 'Update profile'}</a>
    </div>
  </div>
  <div class="card-body">
    <div class="user-info">
      <div class="display-name">Ruhi</div>
      <div class="company">Title: ${company}</div>
      <div class="email">Location: ${email}</div>
    </div>
  </div></div>
  <div class="additional-data">
<div class="card-body">
  <div class="user-info">
    <div class="display-name">My Role: ${displayName}</div>
    <div class="company">My Industry: ${company}</div>
    <div class="email">My Interests: ${email}</div>
  </div>
</div></div>
  `);

  block.textContent = '';
  block.append(accountCardDOM);
  await decorateIcons(block);
}
