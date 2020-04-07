import { TestBed, inject } from '@angular/core/testing';

import { RecipesResolverService } from './recipes-resolver.service';

describe('RecipesResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipesResolverService]
    });
  });

  it('should ...', inject([RecipesResolverService], (service: RecipesResolverService) => {
    expect(service).toBeTruthy();
  }));
});
