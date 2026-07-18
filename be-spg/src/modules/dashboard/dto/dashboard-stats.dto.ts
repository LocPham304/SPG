export class DashboardStatsDto {
  totalArticles!: number;
  publishedArticles!: number;
  draftArticles!: number;
  hiddenArticles!: number;
  newContacts!: number;
  inProgressContacts!: number;
  resolvedContacts!: number;
  activeEmployees!: number;
  totalEmployees!: number;
  totalMedia!: number;

  constructor(partial: DashboardStatsDto) {
    Object.assign(this, partial);
  }
}
