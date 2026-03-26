
const startTotal = Date.now();
try {
  console.log('Attempting to load index.js...');
  const startReq = Date.now();
  const index = require('./index.js');
  console.log(`Successfully required index.js in ${Date.now() - startReq}ms`);

  const exportsToTest = Object.keys(index);
  console.log(`Found ${exportsToTest.length} exports. Testing them...`);

  for (const exp of exportsToTest) {
    const startExp = Date.now();
    try {
      // Just accessing it won't trigger the require if it's already a value,
      // but if it's a getter or a function that triggers a require, we'll see it.
      const val = index[exp];
      console.log(`- Export ${exp} accessed in ${Date.now() - startExp}ms`);
    } catch (err) {
      console.error(`- Export ${exp} FAILED: ${err.message}`);
    }
  }

} catch (e) {
  console.error('Failed to load index.js:');
  console.error(e);
}
console.log(`Total test time: ${Date.now() - startTotal}ms`);
