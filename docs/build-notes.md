# Build Notes

## Data Structure Implementation

### Current Structure
```
src/lib/data/
├── archives/                    # Individual archive files
│   ├── archive-5017.json
│   ├── archive-5018.json
│   └── ...
├── assets/                     # Asset chunks
│   ├── assets-chunk-1.json     # First 1000 assets
│   ├── assets-chunk-2.json     # Next 1000 assets
│   └── ...
└── index/                      # Index files
    └── index.json             # Main index with metadata and relationships
```

### TODO: Implement Data Loading Functions
1. **Chunk Loading**
   - [ ] Add `loadAssetChunk(chunkNumber: number)` function
   - [ ] Add `loadAssetById(assetId: string)` function that finds the right chunk
   - [ ] Add caching for frequently accessed chunks

2. **Search Functionality**
   - [ ] Add `searchAssets(query: string)` function
   - [ ] Implement chunk-based search to avoid loading all assets
   - [ ] Add search result caching

3. **Update Functions**
   - [ ] Add `updateArchive(archiveId: string, data: Partial<FotoWareArchive>)` function
   - [ ] Add `updateAsset(assetId: string, data: Partial<FotoWareAsset>)` function
   - [ ] Add `addNewAssets(assets: FotoWareAsset[])` function
   - [ ] Implement chunk management for new assets

4. **Performance Optimizations**
   - [ ] Add chunk preloading for common access patterns
   - [ ] Implement chunk compression
   - [ ] Add chunk validation and repair functions

5. **Data Integrity**
   - [ ] Add checksum verification for chunks
   - [ ] Implement backup/restore functionality
   - [ ] Add data validation on load

### Implementation Notes
- Each asset chunk should contain 1000 assets maximum
- Archive files should be individual for easy updates
- Index file should be the single source of truth for relationships
- All functions should be memory-efficient and only load required data
- Consider implementing a simple caching layer for frequently accessed data

### Future Considerations
- Consider implementing a proper database if the data grows beyond 100,000 assets
- Look into implementing full-text search capabilities
- Consider adding asset metadata indexing for faster searches
- Plan for implementing asset versioning if needed