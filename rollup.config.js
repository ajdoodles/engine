import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import multi from "@rollup/plugin-multi-entry";

export default {
    input: {
        include: ["src/**/*.ts", "src/**/*.js"],
        exclude: ["src/types.d.ts"]
    },
    output: {
        sourcemap: true,
        dir: 'public_html/'
    },
    plugins: [multi(), nodeResolve(), typescript()]
}