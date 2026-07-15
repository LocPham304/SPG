import { HomeHeroClient } from "./HomeHero.client";

type HomeHeroProps = {
  firstLine: string;
  secondLine: string;
};

export function HomeHero({ firstLine, secondLine }: HomeHeroProps) {
  return <HomeHeroClient firstLine={firstLine} secondLine={secondLine} />;
}
