import { cva, css } from "../styled-system/css/"
import { closeDialog } from "../components/NormalDialog.tsx"

export function About(){
  return (
    <>
      <main class={ css({ marginLeft: "1rem"})}>
      <div class={ css({ textAlign: "left" })}>
        <h1>
          このシステムは以下のframework, libraryを使用しています。
        </h1>
      </div>
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
          <td>Apache License Version 2.0</td>
          <td>drizzle team</td>
        </tr>
        <tr>
          <td>pg</td>
          <td>MIT License</td>
          <td>Copyright 2010 - 2021 Brian Carlson</td>
        </tr>
        <tr>
          <td>html2pdf</td>
          <td>MIT License</td>
          <td>Copyright (c) 2024 Erik Koopmans</td>
        </tr>
        </tbody>
      </table>
      <div class={css({ textAlign: "left" })}>
        <div><a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer">※ MIT License(https://opensource.org/license/mit)</a></div>
        <div><a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer">※　Apache License Version 2.0(http://www.apache.org/licenses/LICENSE-2.0)</a></div>
      </div>
      <div>
        <button type="button" class={ css({ cursor: "pointer" })}
          onClick={closeDialog}>閉じる</button>
      </div>
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