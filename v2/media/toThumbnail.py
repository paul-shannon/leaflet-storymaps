from PIL import Image
import sys
args = sys.argv
assert(len(args) == 2)
inputFile = args[1]
baseName = inputFile.split(".")[0]
fileExtension = inputFile.split(".")[1]
if fileExtension == "jpg":
    fileExtension = "jpeg"
    
outputFile = "%s-thumb.%s" % (baseName, fileExtension)

def create_thumbnail(input_path, output_path, size=(128, 128), format="JPEG"):
    """
    Creates a thumbnail of a JPEG image.

    Args:
        input_path (str): The path to the input JPEG image.
        output_path (str): The path to save the generated thumbnail.
        size (tuple): A tuple (width, height) defining the maximum dimensions
                      of the thumbnail. The aspect ratio will be maintained.
    """
    try:
        with Image.open(input_path) as img:
            img.thumbnail(size)  # Create the thumbnail
            img.save(output_path, format)  # Save as JPEG
        print(f"Thumbnail created successfully at: {output_path}")
    except FileNotFoundError:
        print(f"Error: Input file not found at {input_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage:
input_image = inputFile
outputFile = "%s-thumbnail.png" % baseName
thumbnail_dimensions = (256, 256) # Desired maximum width and height

create_thumbnail(inputFile, outputFile, thumbnail_dimensions, fileExtension)

    
