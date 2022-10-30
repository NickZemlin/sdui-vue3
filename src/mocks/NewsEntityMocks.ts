import { createNewsEntity } from "@/models/NewsEntity";
import { faker } from "@faker-js/faker";

export default function MockNews(ammount: number) {
  const output = [];
  for (let i = 0; i < ammount; i++) {
    output.push(
      createNewsEntity({
        title: `${faker.word.noun()} ${faker.word.adjective()}`,
        body: faker.lorem.paragraph(3),
        author: faker.name.fullName(),
        id: i,
      })
    );
  }
  return output;
}
