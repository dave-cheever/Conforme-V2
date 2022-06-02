import { format } from "date-fns";

import { IResponse } from "../../interfaces/IResponse";

const getResponseWeeklyEmail = (
  template,
  { responses }: { responses: IResponse[] }
) => {

  const responseTable = `
    <table style="font-family: arial, sans-serif;border-collapse: collapse;width: 100%;">
      <tr>
        <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Name</th>
        <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Due date</th>
        <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Primary responsible person</th>
      </tr>
      ${responses.length > 0 ? `
        ${responses.map((response) => (
      `<tr>
            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">${response.complianceItem.name}</td>
            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">${response.nextRenewalDate ? format(response.nextRenewalDate, "dd/MM/yyyy") : ''}</td>
            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">${response.responsible.firstName} ${response.responsible.lastName}</td>
          </tr>`
    )).join('')}` : `<tr><td style="border: 1px solid #dddddd;text-align: center;padding: 8px;" colspan="3">No Data available.</td></tr>`}
    </table>
  `;

  template = template.split("%ResponseTable%").join(responseTable);
  return template;
};

export default getResponseWeeklyEmail;
