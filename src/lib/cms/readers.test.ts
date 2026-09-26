import { describe, it, expect } from "vitest";
import {
  getOrganizations,
  getOrganizationBySlug,
  getEvents,
  getEventBySlug,
  getLeadership,
} from "./readers";

import { createContentModule } from "./content";
const reader = createContentModule(null, "");

describe("published bootstrap readers", () => {
  it("returns organizations", async () => {
    const orgs = await getOrganizations(reader);
    expect(orgs.length).toBeGreaterThan(0);
  });

  it("finds an organization by slug", async () => {
    const org = await getOrganizationBySlug("the-beacon-publications", reader);
    expect(org?.name).toBe("The Beacon Publications");
  });

  it("returns null for an unknown organization slug", async () => {
    expect(await getOrganizationBySlug("does-not-exist", reader)).toBeNull();
  });

  it("returns events", async () => {
    expect((await getEvents(reader)).length).toBeGreaterThan(0);
  });

  it("finds an event by slug", async () => {
    const evt = await getEventBySlug("recweek-orgfair-2026", reader);
    expect(evt?.organization).toBe("COA-Z");
  });

  it("returns null for an unknown event slug", async () => {
    expect(await getEventBySlug("nope", reader)).toBeNull();
  });

  it("returns leadership", async () => {
    expect((await getLeadership(reader)).length).toBeGreaterThan(0);
  });
});
