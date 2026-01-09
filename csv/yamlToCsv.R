library(yaml)
args <- commandArgs(trailingOnly=TRUE)

stopifnot(length(args) == 1)
baseName <- args[1]
printf("baseName: %s", baseName)
yamlFile <- sprintf("%s.yaml", baseName)
stopifnot(file.exists(yamlFile))

printf("reading %s", yamlFile)
x <- yaml.load(readLines(yamlFile))
items <- x$items
count <- length(items)

titles <- vector(mode="character", length=count)
artists <- vector(mode="character", length=count)
lats <- vector(mode="numeric", length=count)
lons <- vector(mode="numeric", length=count)
descriptions <- vector(mode="character", length=count)
medias <- vector(mode="character", length=count)
categories <- vector(mode="character", length=count)

for(i in seq_len(count)){
   item <- items[[i]]
   titles[i] <- sprintf('"%s"', item$title)
   lats[i] <- item$lat
   lons[i] <- item$lon
   descriptions[i] <- sprintf('"%s"', item$description)
   medias[i] <- item$media
   artists[i] <- item$artist
   categories[i] <- item$categories
   }
tbl <- data.frame(Latitude=lats, Longitude=lons, Chapter=titles,
                  Description=descriptions, 'media'=medias,
                  artist=artists, categories=categories)
colnames(tbl)[5] <- "Media Link"
csvFilename <- sprintf("%s.csv", baseName)
printf("writing %d rows to %s", nrow(tbl), csvFilename)
write.table(tbl, file=csvFilename, sep=",", quote=FALSE, row.names=FALSE)
