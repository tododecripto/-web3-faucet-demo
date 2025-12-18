// scripts/debug-args.ts
async function main() {
  console.log("process.argv:", process.argv);
  console.log("Arguments passed to script:", process.argv.slice(2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
