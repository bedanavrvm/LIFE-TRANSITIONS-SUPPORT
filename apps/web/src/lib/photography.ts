import family from '../assets/photos/family.jpg';
import childcare from '../assets/photos/childcare.jpg';
import babyCare from '../assets/photos/baby-care.jpg';
import homeCare from '../assets/photos/home-care.jpg';
import companionship from '../assets/photos/companionship.jpg';
import conversation from '../assets/photos/conversation.jpg';
import community from '../assets/photos/community.jpg';
import consultation from '../assets/photos/consultation.jpg';

// Stock photographs illustrate care; they do not depict our staff or clients.
export const photography = {
  family: { src: family, alt: 'A family sharing a warm group hug at home.', position: '50% 43%' },
  childcare: { src: childcare, alt: 'An adult playing with two young children on a rug at home.', position: '50% 40%' },
  babyCare: { src: babyCare, alt: 'A baby’s foot resting gently against a parent’s hand.', position: '50% 50%' },
  homeCare: { src: homeCare, alt: 'A younger woman sitting beside an older man and holding his hand.', position: '50% 42%' },
  companionship: { src: companionship, alt: 'A younger woman offering an older man a steadying hand at home.', position: '0% 40%' },
  conversation: { src: conversation, alt: 'Two women sitting on a sofa and talking, with one holding a notebook.', position: '50% 63%' },
  community: { src: community, alt: 'Five women gathered together in conversation indoors.', position: '50% 35%' },
  consultation: { src: consultation, alt: 'A healthcare professional and a woman looking at a clipboard together.', position: '58% 38%' },
};

export const coursePhotography: Record<string, keyof typeof photography> = {
  'safe-baby-care': 'babyCare',
  'childcare-foundations': 'childcare',
  'caring-at-home': 'homeCare',
};
