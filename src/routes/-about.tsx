import { cva, css } from "../styled-system/css/"

export function About(){
  return (
    <>
      <main class={ css({ marginLeft: "1rem"})}>
      <h1>
        このシステムは以下のframework, libraryを使用しています。
      </h1>
      <table class={ style() }>
        <thead>
          <tr>
            <th>name</th>
            <th>license</th>
            <th>copyright</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>TanStack Start</td>
          <td>MIT License</td>
          <td>Copyright (c) 2021-present Tanner Linsley</td>
        </tr>
        <tr>
          <td>SOLIDJS</td>
          <td>MIT License</td>
          <td>Copyright (c) 2016-2025 Ryan Carniato</td>
        </tr>
        <tr>
          <td>nitro</td>
          <td>MIT License</td>
          <td>Copyright (c) Pooya Parsa &ltpooya@pi0.io&gt and Nitro contributors</td>
        </tr>
        <tr>
          <td>zod</td>
          <td>MIT License</td>
          <td>Copyright (c) 2025 Colin McDonnell</td>
        </tr>
        <tr>
          <td>Panda</td>
          <td>MIT License</td>
          <td>Copyright (c) 2023 Segun Adebayo</td>
        </tr>
        <tr>
          <td>drizzle-orm</td>
          <td><a href="http://www.apache.org/licenses/LICENSE-2.0">Apache License Version 2.0(link)</a></td>
          <td>drizzle team</td>
        </tr>
        <tr>
          <td>libsql</td>
          <td>MIT License</td>
          <td>Copyright 2023 the sqld authors</td>
        </tr>
        <tr>
          <td>html2pdf</td>
          <td>MIT License</td>
          <td>Copyright (c) 2024 Erik Koopmans</td>
        </tr>
        </tbody>
      </table>
      </main>
  </>);
}

const style = cva({
  base: {
    "& th, td": {
      border: "1px solid black",
      borderCollapse: "collapse",
      padding: "5px",
    }
  },
});