import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import multi from "@rollup/plugin-multi-entry";

export default {
    input: {
        include: ["public_html/src/**/*.ts", "public_html/src/**/*.js"],
        exclude: ["public_html/src/types.d.ts"]
    },
    output: {
        sourcemap: true,
        dir: 'public_html/'
    },
    plugins: [multi(), nodeResolve(), typescript()]
}