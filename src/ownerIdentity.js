// The existing Firebase account for liasjack1@gmail.com. A UID stays tied to
// this account even if its email changes. Keep firestore.rules in sync.
export const OWNER_UID = 'Tqvyw7Vqa9fEuJieoBJSuVC358o2';

export function isOwner(user) {
  return user?.uid === OWNER_UID;
}
