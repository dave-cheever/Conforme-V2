import commandLineArgs from 'command-line-args';
import dotenv from 'dotenv';

const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue: 'production',
    type: String,
  },
]);

if (options.env === 'dev') {
  const result2 = dotenv.config({
    path: `./env/${options.env}.env`,
  });
  if (result2.error) 
    throw result2.error;
  
}
