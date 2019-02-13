import * as shell from "shelljs";

shell.cp("-R", "package.json", "dist/");
shell.cp("-R", "env.json", "dist/");
shell.cp("-R", "API.md", "dist/");
