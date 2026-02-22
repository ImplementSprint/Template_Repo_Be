import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../src/supabase/supabase.service';

describe('SupabaseService', () => {
  let service: SupabaseService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                SUPABASE_URL: 'https://test-project.supabase.co',
                SUPABASE_ANON_KEY: 'test-anon-key',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize supabase client on module init', () => {
    service.onModuleInit();
    expect(service.getClient()).toBeDefined();
  });

  it('should throw if client not initialized', () => {
    // Create a service with missing config
    const mockConfig = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;

    const uninitService = new SupabaseService(mockConfig);
    uninitService.onModuleInit();

    expect(() => uninitService.getClient()).toThrow(
      'Supabase client not initialized',
    );
  });
});
