import nlp from 'compromise';

const past = (phrase: string) => {
  const doc = nlp(phrase);
  doc.verbs().toPastTense();
  return doc.text();
}

export default past;
