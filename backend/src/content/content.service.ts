import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../common/store.service.js';
import { WebsiteContentItem } from '../common/types.js';

@Injectable()
export class ContentService {
  constructor(private readonly storeService: StoreService) {}

  async getAllContent(): Promise<WebsiteContentItem[]> {
    return this.storeService.getContent();
  }

  async getPublicSection(sectionKey: string): Promise<Record<string, any>> {
    const section = await this.storeService.getContentSection(sectionKey);
    if (!section || !section.isPublished) {
      return {};
    }
    return {
      title: section.title,
      subtitle: section.subtitle,
      ...(section.contentPayload || {}),
    };
  }

  async getAdminSection(sectionKey: string): Promise<WebsiteContentItem> {
    let section = await this.storeService.getContentSection(sectionKey);
    if (!section) {
      // Auto-create empty section if requested
      section = await this.storeService.saveContentDraft(sectionKey, {}, '', '');
    }
    // Ensure draftPayload exists for admin
    if (!section.draftPayload || Object.keys(section.draftPayload).length === 0) {
      section.draftPayload = JSON.parse(JSON.stringify(section.contentPayload || {}));
    }
    return section;
  }

  async saveDraft(
    sectionKey: string,
    payload: { title?: string; subtitle?: string; draftPayload: Record<string, any> }
  ): Promise<WebsiteContentItem> {
    return this.storeService.saveContentDraft(
      sectionKey,
      payload.draftPayload || {},
      payload.title,
      payload.subtitle
    );
  }

  async publishSection(sectionKey: string, adminName = 'Administrator'): Promise<WebsiteContentItem> {
    return this.storeService.publishContentSection(sectionKey, adminName);
  }

  async discardDraft(sectionKey: string): Promise<WebsiteContentItem> {
    return this.storeService.discardContentDraft(sectionKey);
  }

  async rollbackRevision(
    sectionKey: string,
    revisionId: string,
    adminName = 'Administrator'
  ): Promise<WebsiteContentItem> {
    return this.storeService.rollbackContentRevision(sectionKey, revisionId, adminName);
  }

  async getWebsiteSettings() {
    return this.storeService.getWebsiteSettings();
  }

  async updateWebsiteSettings(settings: Record<string, any>) {
    return this.storeService.updateWebsiteSettings(settings);
  }

  async getModulesSummary(): Promise<any[]> {
    const all = await this.storeService.getContent();
    const modules = [
      { key: 'home_hero', name: 'Homepage Hero & Headings', route: '/admin/website/homepage' },
      { key: 'services_content', name: 'Services Management', route: '/admin/website/services' },
      { key: 'about_overview', name: 'About Us Management', route: '/admin/website/about' },
      { key: 'contact_details', name: 'Contact Us Management', route: '/admin/website/contact' },
      { key: 'careers_content', name: 'Careers Content & Messaging', route: '/admin/website/careers' },
      { key: 'navigation_config', name: 'Navigation & Header', route: '/admin/website/navigation' },
      { key: 'footer_config', name: 'Footer Management', route: '/admin/website/footer' },
      { key: 'media_library', name: 'Website Media Library', route: '/admin/website/media' },
      { key: 'seo_metadata', name: 'SEO & Metadata', route: '/admin/website/seo' },
      { key: 'website_settings', name: 'Website Settings', route: '/admin/website/settings' },
    ];

    return modules.map((m) => {
      const sec = all.find((c) => c.sectionKey === m.key);
      return {
        ...m,
        isConfigured: !!sec,
        hasDraft: !!sec?.hasDraft,
        isPublished: sec ? sec.isPublished : true,
        updatedAt: sec?.updatedAt || null,
        publishedAt: sec?.publishedAt || null,
      };
    });
  }
}
