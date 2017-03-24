import { DungeonCrawlerPage } from './app.po';

describe('dungeon-crawler App', () => {
  let page: DungeonCrawlerPage;

  beforeEach(() => {
    page = new DungeonCrawlerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
