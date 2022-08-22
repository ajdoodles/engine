import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import multi from "@rollup/plugin-multi-entry";

export default {
    input: ["public_html/src/**/*.ts", "public_html/src/**/*.js"],
    output: {
        dir: 'public_html/build'
    },
    plugins: [multi(), nodeResolve(), typescript()]
}